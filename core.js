import { ENERGY_LEVEL_MULTIPLIER } from "./constants.js"
import { getMultiTapLevel, getRechargingSpeed, getUserEnergyLimit, increasementUserPoints } from "./database.js"
import { decreaseEnergy, getUserEnergyLevel, increaseEnergyLevel } from "./energy.js"




const validataInitData = (initData) => {
    return true 
} 


export const tapHandler = (userId, ws) => {

    const energyLevel = getUserEnergyLevel(userId)
    
    if(energyLevel <= 0) return 
    
    const multiTapLevel = getMultiTapLevel(userId)
    const newPoints = increasementUserPoints(userId, 1 * multiTapLevel)
    const newEnergyLevel = decreaseEnergy(userId)
    const socketMsg = {type : "update", field : "points", points : newPoints}
    
    const socketMsgEnergy = {type : "update", field : "energy", energy : newEnergyLevel}
    
    ws.send(JSON.stringify(socketMsg))
    ws.send(JSON.stringify(socketMsgEnergy))
}


export const energyHandler = (userId, ws) => {
    // console.log(userId)
    const rechargingSpeed = getRechargingSpeed(userId)
    const energyLimit = getUserEnergyLimit(userId)
    const newEnergyLevel = increaseEnergyLevel(userId, rechargingSpeed, energyLimit * ENERGY_LEVEL_MULTIPLIER)
    const socketMsgEnergy = {type : "update", field : "energy", energy : newEnergyLevel}
    
    try{
        ws.send(JSON.stringify(socketMsgEnergy))
    }catch(e){
        console.log(e)
        pass
    }
    
}


export const boostHandler = (userId, boostId) => {
}