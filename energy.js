
const userEnergies = {}


export const decreaseEnergy = (userId) => {
    if(!userEnergies[userId]){
        userEnergies[userId] = 0
        return 0
    }

    if(userEnergies[userId] == 0) return 0
    userEnergies[userId] -= 1
    return userEnergies[userId]
    // Decrease user energy level
}

export const getUserEnergyLevel = (userId) => {
    return userEnergies[userId]
}

export const setUserEnergy = (userId, level) => {
    userEnergies[userId] = level
    return userEnergies[userId]
}

export const setEnergyIfNotExists = (userId, level) => {
    
    if(!userEnergies[userId]){
        userEnergies[userId] = level
    }

    return userEnergies[userId]
}

export const increaseEnergyLevel = (userId, by, max) => {
    if(!userEnergies[userId]) {
        userEnergies[userId] = by
        return by
    }
    
    userEnergies[userId] += by

    if(userEnergies[userId] > max) {
        userEnergies[userId] = max
    }

    return userEnergies[userId]
}





