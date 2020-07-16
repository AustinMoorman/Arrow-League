const mysql = require('mysql');
require('dotenv').config({ path: '../.env' })

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_DATABASE
});

const archerDB = {}

archerDB.addArchers = (roster, leagueID, team, freeScoring) => {

    return new Promise((resolve, reject) => {
        let archers = []
        if (team == 'team') {
            roster.forEach(team => {
                let teamName = team.teamName
                teamName = teamName.charAt(0).toUpperCase() + teamName.slice(1)
                team.member.forEach(archer => {
                    archers.push([leagueID, archer.name, teamName, !freeScoring, archer.scorer])
                })
            })
        } else {
            archers = roster.map(team => {
                return [leagueID, team.member[0].name, 'individual', !freeScoring, team.member[0].scorer]
            })
        }
        if (freeScoring){

        }
        connection.query(`INSERT INTO archer (leagueID, name, team, fixedScorer, fixedScorerIndex) VALUES ?`,[archers], (err,row) => {
            if(err) {
                return reject(err)
            }
            resolve()
        })
    })
}
archerDB.getArchers = leagueID => {
    return new Promise((resolve, reject) => {
        connection.query(`SELECT * from archer WHERE leagueID = ? ORDER BY lastEdit ASC`,[leagueID], (err,rows) => {
            if(err){
                return reject(err)
            }
            resolve(rows)
        })
    })
}
archerDB.createScorer = gameID => {
    return new Promise((resolve, reject) => {
        connection.query(`INSERT INTO scorer (gameID) VALUES (?)`,[gameID], (err,row) => {
            if(err){
                console.log(err)
                return reject(err)
            }
            resolve(row.insertId)
        })
    })
}
archerDB.addScorer = change => {
    return new Promise((resolve, reject) => {
        connection.query(`UPDATE archer SET scorerID = ?, socketID = ?, lastEdit = ? WHERE ID = ? AND leagueID = ?`,[change.scorerID, change.socketID, Date.now(), change.archerID, change.leagueID], (err,rows) => {
            if(err){
                return reject(err)
            }
            resolve()
        })
    })
}
archerDB.removeScorerSocket = socketID => {
    return new Promise((resolve, reject) => {
        connection.query(`UPDATE archer SET socketID = ? WHERE socketID = ?`,[null, socketID], (err,rows) => {
            if(err){
                return reject(err)
            }
            resolve()
        })
    })
}
archerDB.verifyFixedScorer = (scorerIndex,archerID) => {
    return new Promise((resolve, reject) => {
        connection.query(`SELECT * from archer WHERE ID = ? AND fixedScorer = TRUE AND fixedScorerIndex = ?`,[archerID ,scorerIndex], (err,row) => {
            if(err){
                return reject(err)
            }
            if(row.length){
                return resolve(true)
            }else{
                return resolve(false)
            }
        })
    })
}



module.exports = archerDB