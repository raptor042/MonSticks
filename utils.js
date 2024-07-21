
export const getCurrentDay = () => {
    const now  = new Date()
    return `${now.getFullYear()}-${now.getMonth()}-${now.getDate()}`
}