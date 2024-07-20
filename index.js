import express from "express"
// import { WebSocketServer } from "ws"
import WebSocketServer from "express-ws"
import cors from "cors"
import { energyHandler, tapHandler } from "./core.js";
import {bot} from  "./bot.js"
import { increaseEnergyLevel, setEnergyIfNotExists } from "./energy.js";
import { getUserEnergyLimit } from "./database.js";
import { ENERGY_LEVEL_MULTIPLIER } from "./constants.js";
import { getUserIdFromInitData, validateInitData } from "./validator.js";

const app = express();
const expressWs = WebSocketServer(app)
app.use(express.json());
app.use(cors())
// const server = http.createServer(app);
// const wss =  new WebSocketServer({server}) 


const users = {}

app.get('/', (req, res) => {
    res.send("Cool");
  });


app.ws("/ws",  (ws, req) => {
    
    console.log("New connection")
    
    let invervalId = null
    ws.on("message", (data) => {
        // console.log(data)
        const parsedData = JSON.parse(data)
        const msgType = parsedData['type']
        const isValidData = validateInitData(parsedData['initData'])
        
        if(!isValidData) {
            console.log("Invalid data")
            return 
        }
        
        if(msgType == "subscribe") {
            
            const userId = getUserIdFromInitData(parsedData['initData'])
            console.log("Subscribing to user events")
            users[userId] = ws
            const userEnergyLevel = getUserEnergyLimit(userId)
            
            const newLevel = setEnergyIfNotExists(userId, userEnergyLevel * ENERGY_LEVEL_MULTIPLIER)
            const socketMsgEnergy = {type : "update", field : "energy", energy : newLevel}
            const maxEnergyLimit = {type : "update", field : "energyLimit", energyLimit : userEnergyLevel * ENERGY_LEVEL_MULTIPLIER}
            invervalId = setInterval(() => energyHandler(userId, ws), 1000)
            ws.send(JSON.stringify(maxEnergyLimit))
            ws.send(JSON.stringify(socketMsgEnergy))
        }

        else if(msgType == "tap") {
            const userId = getUserIdFromInitData(parsedData['initData'])
            tapHandler(userId, ws)
            console.log("Tap message received")
        }
    
    })
    
    ws.on("close", () => {
        console.log("Disconnected")
        clearInterval(invervalId)
    } )
    // ws.on("connect", ())

    ws.on("ping", () => {
        ws.emit("pong")
    })

})

// server.listen(3001, '0.0.0.0', () => {
//     console.log("Listening on port 3001")
// } )


app.listen(3001, "0.0.0.0", () => {
    console.log("Listening on port 3001")
})