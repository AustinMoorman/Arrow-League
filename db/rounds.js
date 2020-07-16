const mysql = require('mysql');
require('dotenv').config({ path: '../.env' })

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_DATABASE
});

const roundsDB = {}

roundsDB.getRoundsByLeagueID = leagueID => {
    return new Promise((resolve, reject) => {
        connection.query(`SELECT * from rounds WHERE leagueID = ?`, [leagueID], (err, rows) => {
            if (err) {
                return reject(err)
            }
            resolve(rows)
        })
    })
}
roundsDB.getRoundsByGameID = gameID => {
    return new Promise((resolve, reject) => {
        connection.query(`SELECT * from rounds WHERE gameID = ?`, [gameID], (err, rows) => {
            if (err) {
                return reject(err)
            }
            resolve(rows)
        })
    })
}
roundsDB.addRound = (scores,game) => {
    return new Promise((resolve, reject) => {
        connection.query(`INSERT INTO rounds (hostID, leagueID, time, lastEdit, archerID, team, gameID, arrows, total, xCount, round) VALUES (?,?,?,?,?,?,?,?,?,?,?)`,[game.hostID, game.leagueID, Date.now(), Date.now(), scores.archerID, scores.team, game.ID, JSON.stringify(scores.scores), scores.total, scores.xCount, scores.round], err => {
            if(err) {
                return reject(err)
            }
            resolve()
        })

    })
}

module.exports = roundsDB