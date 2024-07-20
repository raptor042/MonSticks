
// A user boost will have 
// 1. userId 
// 2. points,
// 3. duration,
// 4. name

const boostProcessor = async () => {
    
    
    // Handle boost processing
}

const userBoosts = {}


export const addBoost = (userId, boostData) => {
    userBoosts[userId] = boostData
}


export const getUserBoosts = (userId) => {
    return userBoosts[userBoosts]
}


