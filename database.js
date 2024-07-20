import Database from "better-sqlite3"

const db = new Database("database.db")


db.prepare(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY,
        ref_link TEXT,
        ref_by TEXT,
        taps INTEGER DEFAULT 0,
        points INTEGER DEFAULT 0,
        level INTEGER DEFAULT 0,
        multi_tap_level INTEGER DEFAULT 1,
        energy_limit_level INTEGER DEFAULT 1,
        recharging_speed INTEGER DEFAULT 1
)`).run()


db.prepare(`CREATE TABLE IF NOT EXISTS levels (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    points INTEGER
)`).run()



db.prepare(`CREATE TABLE IF NOT EXISTS boosts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    duration INTEGER,
    points INTEGER,
    level INTEGER

)`).run()


db.prepare(`CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY,
    name TEXT,
    rewards INTEGER,
    points INTEGER,
    type TEXT

)`).run()

export const getUserEnergyLimit = (userId) => {
    const row = db.prepare(`SELECT energy_limit_level from users WHERE id = ?`).get(userId)
    return row ? row.energy_limit_level : 0
}

export const getRechargingSpeed = (userId) => {
    const row = db.prepare(`SELECT recharging_speed from users WHERE id = ?`).get(userId)
    return row ? row.recharging_speed : 0
}

export const getUser = (userId) => {
    const row = db.prepare(`SELECT * from users WHERE id = ?`).get(userId)
    return row
}


export const addUser = (userId, refLink, refBy) => {
    const  insertUser = db.prepare('INSERT INTO users (id, ref_link, ref_by) VALUES (?, ?, ?)').run(
        userId, refLink, refBy
    );
    return insertUser.lastInsertRowid
}


export const getBoosts = () => {
    const rows = db.prepare(`SELECT * from boosts`).all()
    console.log(rows)
}


export const increasementUserPoints = (userId, increaseBy) => {
     // Update user points
     const stmt = db.prepare('UPDATE users SET points = points + ?,  taps = taps + 1  WHERE id = ?');
     const info = stmt.run(increaseBy, userId);
     // Get the updated points value with a separate SELECT query
     const user = db.prepare('SELECT points FROM users WHERE id = ?').get(userId);
     return user ? user.points : 0;
}


export const getMultiTapLevel = (userId) => {
    const res = db.prepare(`SELECT  multi_tap_level FROM users  WHERE id = ?`).get(userId)
    return res ? res.multi_tap_level : 0
}


export const getTasks = () => {
    const rows = db.prepare(`SELECT * from tasks`).all()
    console.log(rows)
}