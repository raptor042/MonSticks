import { handleUpgradeMultiTap } from "./core.js";
import { addDailyBooster, addUser, getMultiTapLevel, getUser, getUserDailyBooster, getUsersStats, increamentUserDailyBooster, updateUser } from "./database.js";
import { decreaseEnergy, getUserEnergyLevel, increaseEnergyLevel, setEnergyIfNotExists, setUserEnergy } from "./energy.js";
import { getCurrentDay } from "./utils.js";




// const res = getUsersStats()
// console.log(res)
// handleUpgradeMultiTap(5564874561)
const res = updateUser(5564874561, {points : 100, multi_tap_level : 1}, {points : "-" , multi_tap_level: "+"})
console.log(res)
// console.log(getCurrentDay())
// addDailyBooster(122, "2024-07-24", "Tapping Guru")

// let res = increamentUserDailyBooster(122, "2024-07-24", "Full Tank")
// console.log(res)
// res = getUserDailyBooster(122, "2024-07-24", "Full Tank")

// console.log(res)
// setUserEnergy(122, 2)
// addMultiTap(122, "2024-07-20")
// const res = getUserMultiTap(122, "2024-07-20")
// const res = increamentUserMultiTap(122, "2024-07-20")
// console.log(res)
// setEnergyIfNotExists(122, 100)
// increaseEnergyLevel(122, 2, 100)

// console.log(decreaseEnergy(122))
// console.log(getUserEnergyLevel(122))
// addUser(123451, "sdsd")
// console.log(getUser(123451))
// console.log(getMultiTapLevel(123451))
// const newBal = increasementUserPoints(123222, 10)
// console.log(newBal)  