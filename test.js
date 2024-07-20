import { addUser, getMultiTapLevel, increasementUserPoints } from "./database.js";
import { decreaseEnergy, getUserEnergyLevel, increaseEnergyLevel, setEnergyIfNotExists, setUserEnergy } from "./energy.js";

// setUserEnergy(122, 2)
setEnergyIfNotExists(122, 100)
increaseEnergyLevel(122, 2, 100)

console.log(decreaseEnergy(122))
console.log(getUserEnergyLevel(122))
// addUser(123451, "sdsd")
// console.log(getMultiTapLevel(123451))
// const newBal = increasementUserPoints(123222, 10)
// console.log(newBal)  