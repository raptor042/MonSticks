import { Pool } from "pg";
import { config } from "dotenv";

config()

const db = new Pool({
    connectionString: process.env.POSTGRES_URL,
    ssl: {
        rejectUnauthorized: false
    }
})

(async function createUsersTable() {
    try {
        const users = await db.query(`CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY,
            ref_link TEXT,
            ref_by TEXT,
            taps INTEGER DEFAULT 0,
            points INTEGER DEFAULT 0,
            level INTEGER DEFAULT 0,
            multi_tap_level INTEGER DEFAULT 1,
            energy_limit_level INTEGER DEFAULT 1,
            recharging_speed INTEGER DEFAULT 1
        )`)
        console.log(users)
    } catch (error) {
        console.log(error)
    }
})()

(async function createLevelstable() {
    try {
        const levels = await db.query(`CREATE TABLE IF NOT EXISTS levels (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            points INTEGER
        )`)
        console.log(levels)
    } catch (error) {
        console.log(error)
    }
})()

(async function createBoostsTable() {
    try {
        const boosts = await db.query(`CREATE TABLE IF NOT EXISTS boosts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            duration INTEGER,
            points INTEGER,
            level INTEGER
        
        )`)
        console.log(boosts)
    } catch (error) {
        console.log(error)
    }
})()

(async function createTasksTable() {
    try {
        const tasks = await db.query(`CREATE TABLE IF NOT EXISTS tasks (
            id INTEGER PRIMARY KEY,
            name TEXT,
            rewards INTEGER,
            points INTEGER,
            type TEXT
        
        )`)
        console.log(tasks)
    } catch (error) {
        console.log(error)
    }
})()

(async function createDailyBoostersTable() {
    try {
        const daily_boosters = await db.query(`CREATE TABLE IF NOT EXISTS daily_boosters (
            id INTEGER PRIMARY KEY,
            user_id INTEGER NOT NULL,
            day TEXT NOT NULL,
            name TEXT NOT NULL,
            used INTEGER DEFAULT 0,
            max INTEGER DEFAULT 3
        )`)
        console.log(daily_boosters)
    } catch (error) {
        console.log(error)
    }
})()