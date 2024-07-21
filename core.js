import { ENERGY_LEVEL_MULTIPLIER, ENERGY_LIMIT_UPGRADE_PRICES, MULTI_TAP_UPGRADE_PRICES, RECHARGE_SPEED_UPGRADE_PRICES } from "./constants.js"
import { getMultiTapLevel, getRechargingSpeed, getUser, getUserDailyBooster, getUserEnergyLimit, increamentUserDailyBooster, increasementUserPoints, updateUser } from "./database.js"
import { decreaseEnergy, getUserEnergyLevel, increaseEnergyLevel, setUserEnergy } from "./energy.js"
import { isTappingGuruActive, updateTappingGuru } from "./tappingGuru.js"
import { getCurrentDay } from "./utils.js"


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

export const handleFullEnergy = (userId, ws) => {
    const name = "Full Energy"
    const today = getCurrentDay()
    const status = getUserDailyBooster(userId, today, name)
    
    if(!status) {
        // Create new booster
        return 
    }
    if(status.used == status.max) return 
    const energyLimitLevel = getUserEnergyLimit(userId)
    const newEnergyLevel = setUserEnergy(userId, energyLimitLevel * ENERGY_LEVEL_MULTIPLIER)
    const newValue  = increamentUserDailyBooster(userId, today, name)
    const socketMsgEnergy = {type : "update", field : "energy", energy : newEnergyLevel}
    const socketMsgBoost = {type : "boost", field : "used", name, used : newValue}
    
    try{
        ws.send(JSON.stringify(socketMsgBoost))
        ws.send(JSON.stringify(socketMsgEnergy))
    }catch(e){
        console.log(e)
        pass
    
    }
}



export const handleTappingGuru = (userId, ws) => {
    const name = "Tapping Guru"
    const today = getCurrentDay()

    const status = getUserDailyBooster(userId, today, name)
    if(!status){
        // Probably create new booster
        return 
    }

    if(status.user == status.max) return 
    if(isTappingGuruActive(userId)) return 
    const newValue  = increamentUserDailyBooster(userId, today, name)
    const guruStatus = updateTappingGuru(userId, true)
    const socketMsgBoost = {type : "boost", field : "used", name, used : newValue}
    const tappingGuruMsg = {type : "boost", field : "status", name, status : guruStatus}

    setTimeout(() => {
        const newGuruStatus = updateTappingGuru(userId, false)
        const newTappingGuruMsg = {type : "boost", field : "status", name, status : newGuruStatus}
        
        try{
            ws.send(JSON.stringify(newTappingGuruMsg))
        }catch(e){
            console.log(e)
        }
    
    }, 20 * 1000)
    
    try{
        ws.send(JSON.stringify(socketMsgBoost))
        ws.send(JSON.stringify(tappingGuruMsg))
    }catch(e){
        console.log(e)
    }



}


export const handleUpgradeMultiTap = (userId, ws) => {
    const user = getUser(userId)
    
    if(!user) {
        console.log("No user")
        return
    } 
    const currentLevel = user.multi_tap_level
    // const nextLevel = currentLevel + 1
    const price = MULTI_TAP_UPGRADE_PRICES[currentLevel -1]
    console.log(price, user.points)
    if(user.points < price) return
    const fieldsToUpdate = {points : price, multi_tap_level : 1}
    const operations = {points : "-" , multi_tap_level: "+"}
    const {points, multi_tap_level } = updateUser(userId, fieldsToUpdate, operations)
    console.log(points, multi_tap_level)
    if(!ws) return 
    console.log("Handling upgrade")
    
    try{
        const pointsUpdateMsg = {type : "update", field : "points", points : points}
        const socketMsgMultiTap = {type : "update", field : "multi_tap_level", multi_tap_level}
        ws.send(JSON.stringify(socketMsgMultiTap))
        ws.send(JSON.stringify(pointsUpdateMsg))
    }catch(e) {
        console.log(e)
    }
}

export const handleEnergyLimitUpgrade = (userId, ws) => {
    const user = getUser(userId)
    
    if(!user) {
        console.log("No user")
        return
    } 

    const currentLevel = user.energy_limit_level
    const price = ENERGY_LIMIT_UPGRADE_PRICES[currentLevel -1]
    if (user.points < price) return
    const fieldsToUpdate = {points : price, energy_limit_level : 1}
    const operations = {points : "-" , energy_limit_level: "+"}
    const {points, energy_limit_level } = updateUser(userId, fieldsToUpdate, operations)
    console.log(points, energy_limit_level)

    if(!ws) return 
    console.log("Handling upgrade")
    
    try{
        const pointsUpdateMsg = {type : "update", field : "points", points : points}
        const socketMsgMultiTap = {type : "update", field : "energy_limit_level", energy_limit_level : energy_limit_level * ENERGY_LEVEL_MULTIPLIER}
        ws.send(JSON.stringify(socketMsgMultiTap))
        ws.send(JSON.stringify(pointsUpdateMsg))
    }catch(e) {
        console.log(e)
    }

}

export const handleRechargeLimitUpgrade = (userId, ws) => {
    const user = getUser(userId)
    
    if(!user) {
        console.log("No user")
        return
    } 
    const currentLevel = user.recharging_speed 
    const price  = RECHARGE_SPEED_UPGRADE_PRICES[currentLevel -1]
    if (user.points < price) return
    const fieldsToUpdate = {points : price, recharging_speed : 1}
    const operations = {points : "-" , recharging_speed: "+"}

    const {points, recharging_speed } = updateUser(userId, fieldsToUpdate, operations)
    console.log(points, recharging_speed)

    if(!ws) return 
    console.log("Handling upgrade")
    
    try{
        const pointsUpdateMsg = {type : "update", field : "points", points : points}
        const socketMsgMultiTap = {type : "update", field : "recharging_speed", recharging_speed}
        ws.send(JSON.stringify(socketMsgMultiTap))
        ws.send(JSON.stringify(pointsUpdateMsg))
    }catch(e) {
        console.log(e)
    }

}

