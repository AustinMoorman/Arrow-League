const mysql = require('mysql');
require('dotenv').config({ path: '../.env' })

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_DATABASE
});

const leagueDB = {}

leagueDB.addGameMode = gameObj => {

    return new Promise((resolve, reject) => {
        connection.query(`INSERT INTO gameMode (userID, name, description, scoreableVals, xVal, apr, rpb, bpg, maxScore) VALUES (?,?,?,?,?,?,?,?,?)`, [gameObj.userID, gameObj.name, gameObj.description, gameObj.scoreableVals, gameObj.xVal, gameObj.apr, gameObj.rpb, gameObj.bpg, gameObj.maxScore], (err, row) => {
            if (err) {
                return reject(err)
            }
            return resolve()
        })
    })
}

leagueDB.getGameModes = email => {

    return new Promise((resolve, reject) => {
        connection.query(`Select * FROM gameMode WHERE userEmail IS NULL OR userEmail = ? `, [email], (err, row) => {
            if (err) {
                return reject(err)
            }
            return resolve(row)
        })
    })
}
leagueDB.addLeague = league => {
    return new Promise((resolve, reject) => {
        connection.query(`INSERT INTO league (creationDate, hostID, leagueName, duration, durationCompleted, handicap, handicapPercentage, handicapMax, team, schedule, gameChanges, freeScoring, scorers) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)`, league, (err, row) => {
            if (err) {
                return reject(err)
            }
            return resolve(row.insertId)
        })
    })
}
leagueDB.getAllLeagues = hostID => {
    return new Promise((resolve, reject) => {
        connection.query(`Select * FROM league WHERE hostID = ? ORDER BY creationDate DESC`, [hostID], (err, rows) => {
            if (err) {
                return reject(err)
            }
            return resolve(rows)
        })
    })
}

leagueDB.checkAccessCode = accessCode => {
    return new Promise((resolve, reject) => {
        connection.query(`Select * FROM games WHERE accessCode = ?`, [accessCode], (err, rows) => {
            if (err) {
                return reject(err)
            }
            if (rows.length) {
                return resolve(true)
            } else {
                return resolve(false)
            }

        })
    })
}
leagueDB.runLeague = (leagueID, hostID, accessCode, eventIndex, gameModeID, scoreboardAccessCode) => {
    return new Promise((resolve, reject) => {
        connection.query(`INSERT INTO games (leagueID, hostID, accessCode, scoreboardAccessCode ,startDate, status, eventIndex, gameModeID) VALUES (?,?,?,?,?,?,?,?)`, [leagueID, hostID, accessCode, scoreboardAccessCode ,Date.now(), 'active', eventIndex, gameModeID], (err, rows) => {
            if (err) {
                return reject(err)
            }
            return resolve()
        })
    })
}
leagueDB.addFixedScorer = (scorer,accessCode,scorerCode,index) => {
    return new Promise((resolve, reject) => {
        connection.query(`INSERT INTO fixedScorer (name, accessCode, scorerCode, scorerIndex) VALUES (?,?,?,?)`, [scorer.name,accessCode,scorerCode,index], (err, rows) => {
            if (err) {
                return reject(err)
            }
            return resolve()
        })
    })
}
leagueDB.getScorersByAccessCode = (accessCode) => {
    return new Promise((resolve, reject) => {
        connection.query(`Select * FROM fixedScorer WHERE accessCode = ?`, [accessCode], (err, rows) => {
            if (err) {
                return reject(err)
            }
            return resolve(rows)
        })
    })
}
leagueDB.getScorerByScorerCode = (scorerCode) => {
    return new Promise((resolve, reject) => {
        connection.query(`Select * FROM fixedScorer WHERE scorerCode = ?`, [scorerCode], (err, row) => {
            if (err) {
                return reject(err)
            }
            return resolve(row[0])
        })
    })
}
leagueDB.gameStatus = (leagueID, index) => {
    return new Promise((resolve, reject) => {
        connection.query(`Select * FROM games WHERE leagueID = ? AND eventIndex = ?`, [leagueID, index], (err, row) => {
            if (err) {
                return reject(err)
            }
            if (row.length) {
                return resolve({ status: row[0].status, accessCode: row[0].accessCode, scoreboardAccessCode: row[0].scoreboardAccessCode })
            } else {
                return resolve({ status: 'unactivated', accessCode: null })
            }

        })
    })
}
leagueDB.setStatus = (accessCode, status) => {
    return new Promise((resolve, reject) => {
        connection.query(`UPDATE games SET status = ? WHERE accessCode = ?`, [status, accessCode], (err, rows) => {
            if (err) {
                return reject(err)
            }
            return resolve()
        })
    })
}
leagueDB.advanceLeague = (leagueID, durationCompleted) => {
    console.log(durationCompleted)
    return new Promise((resolve, reject) => {
        connection.query(`UPDATE league SET durationCompleted = ? WHERE ID = ?`, [durationCompleted, leagueID], (err, rows) => {
            if (err) {
                return reject(err)
            }
            return resolve()
        })
    })
}
leagueDB.changeAccessCode = (oldAccessCode, newAccessCode) => {
    return new Promise((resolve, reject) => {
        connection.query(`UPDATE games SET accessCode = ? WHERE accessCode = ?`, [newAccessCode, oldAccessCode], (err, rows) => {
            if (err) {
                return reject(err)
            }
            return resolve()
        })
    })
}
leagueDB.changeScorerCode = (oldScorerCode, newScorerCode) => {
    return new Promise((resolve, reject) => {
        connection.query(`UPDATE fixedScorer SET scorerCode = ? WHERE scorerCode = ?`, [newScorerCode, oldScorerCode], (err, rows) => {
            if (err) {
                return reject(err)
            }
            return resolve()
        })
    })
}
leagueDB.getGame = accessCode => {
    return new Promise((resolve, reject) => {
        connection.query(`Select * FROM games WHERE accessCode = ? AND status = ?`, [accessCode, 'active'], (err, rows) => {
            if (err) {
                return reject(err)
            }
            if (rows.length) {
                return resolve(rows[0])
            } else {
                return reject('bad access code')
            }

        })
    })
}
leagueDB.getGameModeByGameID = gameID => {

    return new Promise((resolve, reject) => {
        connection.query(`Select gameModeID FROM games WHERE ID = ?`, [gameID], (error, gameModeID) => {
            connection.query(`Select * FROM gameMode WHERE ID = ? `, [gameModeID[0].gameModeID], (err, row) => {
                if (err || error) {
                    return reject(err,error)
                }

                return resolve(row[0])
                
            })
        })
    })
}

module.exports = leagueDB