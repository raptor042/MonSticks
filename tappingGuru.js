// Mapping of user id to bool(if tapping guru is active or not)
const tappingGuru = {}


export const isTappingGuruActive = (userId) => {
    return Boolean(tappingGuru[userId])
}


export const updateTappingGuru = (userId, status) => {
    tappingGuru[userId] = status 
    return status
}