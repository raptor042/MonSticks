import express from "express"
// import { WebSocketServer } from "ws"
import WebSocketServer from "express-ws"
import cors from "cors"
import { energyHandler, handleEnergyLimitUpgrade, handleFullEnergy, handleRechargeLimitUpgrade, handleTappingGuru, handleUpgradeMultiTap, tapHandler } from "./core.js";
import {bot} from  "./bot.js"
import { increaseEnergyLevel, setEnergyIfNotExists } from "./energy.js";
import { addUserIfNotExists, getUser, getUserEnergyLimit, getUsersStats } from "./database.js";
import { ENERGY_LEVEL_MULTIPLIER } from "./constants.js";
import { getUserIdFromInitData, validateInitData } from "./validator.js";
import { getCurrentDay } from "./utils.js";
import shortUUID from "short-uuid";


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



app.get("/stats", (req, res) => {
    const stats = getUsersStats()
    const onlineUsers = expressWs.getWss().clients.size  
    // console.log(onlineUsers)
    const dailyUsers = onlineUsers

    res.send({...stats, onlineUsers, dailyUsers})
        
})




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
            addUserIfNotExists(userId, shortUUID.generate(), null)
            const newLevel = setEnergyIfNotExists(userId, userEnergyLevel * ENERGY_LEVEL_MULTIPLIER)
            const user = getUser(userId)
            const socketMsgEnergy = {type : "update", field : "energy", energy : newLevel}
            const maxEnergyLimit = {type : "update", field : "energyLimit", energyLimit : userEnergyLevel * ENERGY_LEVEL_MULTIPLIER}
            const pointsMsg = {type : "update", field : "points", points : user.points}
            invervalId = setInterval(() => energyHandler(userId, ws), 1000)
            ws.send(JSON.stringify(maxEnergyLimit))
            ws.send(JSON.stringify(socketMsgEnergy))
            ws.send(JSON.stringify(pointsMsg))
        }

        else if(msgType == "tap") {
            const userId = getUserIdFromInitData(parsedData['initData'])
            tapHandler(userId, ws)
            console.log("Tap message received")
        }

        else if(msgType == "Full Energy") {
            
            // const day = getCurrentDay()
            const userId = getUserIdFromInitData(parsedData['initData'])
            handleFullEnergy(userId, ws)
        }else if (msgType == "Tapping Guru") {
            const userId = getUserIdFromInitData(parsedData['initData'])
            handleTappingGuru(userId, ws)
        }else if(msgType == "upgradeMultiTap"){
             // Handle multitap level upgrade level
            const userId = getUserIdFromInitData(parsedData['initData'])
            handleUpgradeMultiTap(userId, ws)
        } else if (msgType == "upgradeEnergyLimit") {
            const userId = getUserIdFromInitData(parsedData['initData'])
            handleEnergyLimitUpgrade(userId, ws)
            // Handle energy limit upgrade

        }else if (msgType == "upgradeRechargeSpeed") {
            const userId = getUserIdFromInitData(parsedData['initData'])
            handleRechargeLimitUpgrade(userId, ws)
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


const port = process.env.PORT || 3001

app.listen(port, "0.0.0.0", () => {
    console.log("Listening on port ", port)
})