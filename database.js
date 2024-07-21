import Database from "better-sqlite3"

const db = new Database("./database/database.db")


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

db.prepare(`CREATE TABLE IF NOT EXISTS daily_boosters (
    id INTEGER PRIMARY KEY,
    user_id INTEGER NOT NULL,
    day TEXT NOT NULL,
    name TEXT NOT NULL,
    used INTEGER DEFAULT 0,
    max INTEGER DEFAULT 3
)`).run()

// db.prepare(`CREATE TABLE IF NOT EXISTS `)


export const addDailyBooster = (userId, day, name) => {
    const  insertMultiTap = db.prepare('INSERT INTO daily_boosters (user_id, day, name) VALUES (?, ?, ?)').run(
        userId, day, name
    );
    return insertMultiTap.lastInsertRowid
}


export const getUserDailyBooster = (userId, day, name) => {
    const row = db.prepare(`SELECT * from daily_boosters WHERE user_id = ? AND day = ? AND name = ?`).get(userId, day, name)
    return row
}


export const getUsersStats = () => {
    const result = db.prepare(` SELECT 
        COUNT(id) AS totalUsers, 
        SUM(taps) AS totalTaps, 
        SUM(points) AS totalPoints 
        FROM users
    `).get();

    return result
}


export const increamentUserDailyBooster = (userId, day, name) => {
       const stmt = db.prepare('UPDATE daily_boosters SET used = used + 1  WHERE user_id = ? AND day = ? and name = ?');
       stmt.run(userId, day, name);
       const multi_tap = db.prepare('SELECT used FROM daily_boosters WHERE user_id = ? and day = ? AND name = ?').get(userId, day, name);
       return multi_tap ? multi_tap.used : null;
} 


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

export const addUserIfNotExists = (userId, refLink, refBy) => {
    const user = getUser(userId)
    if(user) return 

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

export const updateUser = (userId, fieldsToUpdate, operations) => {
    // Base query
    let query = 'UPDATE users SET ';
    const values = [];

    // Dynamically add the fields, operations, and values to the query
    Object.keys(fieldsToUpdate).forEach((field, index) => {
        if (index > 0) {
            query += ', ';
        }
        const operation = operations[field] || '=';
        if (operation === '+' || operation === '-') {
            query += `${field} = ${field} ${operation} ?`;
        } else {
            query += `${field} = ?`;
        }
        values.push(fieldsToUpdate[field]);
    });

    // Add the WHERE clause
    query += ' WHERE id = ?';
    values.push(userId);
    // Prepare and run the query
    const stmt = db.prepare(query);
    stmt.run(...values);

    const fields = Object.keys(fieldsToUpdate).join(', ');
    const selectQuery = `SELECT ${fields} FROM users WHERE id = ?`;
    const updatedRecord = db.prepare(selectQuery).get(userId);
    return updatedRecord;
}