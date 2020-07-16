const mysql = require('mysql');
require('dotenv').config({ path: '../.env' })

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_DATABASE
});

connection.connect();

const seed = () => {
    try {
        connection.query('DROP TABLE IF EXISTS rounds', err => {
            if (err) {
                console.log(err)
                throw new Error()
            } else {
                console.log('rounds table dropped')
            }
        })
        connection.query('DROP TABLE IF EXISTS games', err => {
            if (err) {
                console.log(err)
                throw new Error()
            } else {
                console.log('games table dropped')
            }
        })
        connection.query('DROP TABLE IF EXISTS archer', err => {
            if (err) {
                console.log(err)
                throw new Error()
            } else {
                console.log('archer table dropped')
            }
        })
        connection.query('DROP TABLE IF EXISTS scorer', err => {
            if (err) {
                console.log(err)
                throw new Error()
            } else {
                console.log('scorer table dropped')
            }
        })
        connection.query('DROP TABLE IF EXISTS league', err => {
            if (err) {
                console.log(err)
                throw new Error()
            } else {
                console.log('league table dropped')
            }
        })
        connection.query('DROP TABLE IF EXISTS gameMode', err => {
            if (err) {
                console.log(err)
                throw new Error()
            } else {
                console.log('gameMode table dropped')
            }
        })
        connection.query('DROP TABLE IF EXISTS loginAttempts', err => {
            if (err) {
                console.log(err)
                throw new Error()
            } else {
                console.log('loginAttempts table dropped')
            }
        })
        connection.query('DROP TABLE IF EXISTS user', err => {
            if (err) {
                console.log(err)
                throw new Error()
            } else {
                console.log('user table dropped')
            }
        })
        connection.query('CREATE TABLE user (rangeName TEXT, email VARCHAR(255) NOT NULL UNIQUE, password TEXT, ID VARCHAR(255) NOT NULL PRIMARY KEY, verificationCode TEXT, verified boolean not null default FALSE, resetCode TEXT)', err => {
            if (err) {
                console.log(err)
                throw new Error()
            } else {
                console.log('new user table created')
            }
        })
        connection.query('CREATE TABLE loginAttempts (time BIGINT, success boolean, email VARCHAR(255), FOREIGN KEY (email) REFERENCES user(email))', err => {
            if (err) {
                console.log(err)
                throw new Error()
            } else {
                console.log('new loginAttempts table created')
            }
        })
        connection.query('CREATE TABLE gameMode (ID INT NOT NULL AUTO_INCREMENT, userEmail VARCHAR(255) DEFAULT NULL, name TEXT, description TEXT, scoreableVals TEXT, xVal INT, apr INT, rpb INT, bpg INT, maxScore INT, PRIMARY KEY (ID))', err => {
            if (err) {
                console.log(err)
                throw new Error()
            } else {
                console.log('new gameMode table created')
            }
        })
        connection.query('CREATE TABLE league (ID INT NOT NULL AUTO_INCREMENT,creationDate BIGINT, hostID VARCHAR(255), leagueName TEXT, duration INT, durationCompleted INT, handicap BOOLEAN, handicapPercentage INT, handicapMax INT, team TEXT, schedule TEXT, gameChanges BOOLEAN, freeScoring BOOLEAN, scorers TEXT ,accessCode TEXT, PRIMARY KEY (ID), FOREIGN KEY (hostID) REFERENCES user(ID))', err => {
            if (err) {
                console.log(err)
                throw new Error()
            } else {
                console.log('new league table created')
            }
        })
        connection.query('CREATE TABLE scorer (ID INT NOT NULL AUTO_INCREMENT, gameID INT, PRIMARY KEY (ID))', err => {
            if (err) {
                console.log(err)
                throw new Error()
            } else {
                console.log('new scorer table created')
            }
        })
        connection.query('CREATE TABLE fixedScorer (ID INT NOT NULL AUTO_INCREMENT, name TEXT, accessCode TEXT, scorerCode TEXT, scorerIndex INT, PRIMARY KEY (ID))', err => {
            if (err) {
                console.log(err)
                throw new Error()
            } else {
                console.log('new fixedScorer table created')
            }
        })
        connection.query('CREATE TABLE archer (ID INT NOT NULL AUTO_INCREMENT, leagueID INT, name TEXT, team TEXT, scorerID INT, socketID TEXT, lastEdit BIGINT, fixedScorer BOOLEAN default FALSE, PRIMARY KEY (ID), FOREIGN KEY (leagueID) REFERENCES league(ID),FOREIGN KEY (scorerID) REFERENCES scorer(ID))', err => {
            if (err) {
                console.log(err)
                throw new Error()
            } else {
                console.log('new archer table created')
            }
        })
        connection.query('CREATE TABLE games (ID INT NOT NULL AUTO_INCREMENT, leagueID INT, hostID VARCHAR(255), accessCode TEXT, status TEXT, eventIndex INT, gameModeID INT ,startDate BIGINT, endDate BIGINT, PRIMARY KEY (ID), FOREIGN KEY (leagueID) REFERENCES league(ID), FOREIGN KEY (hostID) REFERENCES user(ID))', err => {
            if (err) {
                console.log(err)
                throw new Error()
            } else {
                console.log('new games table created')
            }
        })
        connection.query('CREATE TABLE rounds (ID INT NOT NULL AUTO_INCREMENT, hostID VARCHAR(255), leagueID INT, time BIGINT, lastEdit BIGINT, archerID INT, team TEXT, gameID INT, arrows TEXT, total INT, xCount INT, round INT, PRIMARY KEY (ID), FOREIGN KEY (hostID) REFERENCES user(ID), FOREIGN KEY (leagueID) REFERENCES league(ID), FOREIGN KEY (archerID) REFERENCES archer(ID), FOREIGN KEY (gameID) REFERENCES games(ID))', err => {
            if (err) {
                console.log(err)
                throw new Error()
            } else {
                console.log('new rounds table created')
            }
        })
        connection.query(`INSERT INTO user (rangeName, email, password, ID) VALUES (?,?,?,?)`, ['Austin Archery', 'austinarchery@gmail.com', 'password', Date.now() + Math.random().toString(36).substring(7)], err => {
            if (err) {
                console.log(err)
                throw new Error()
            } else {
                console.log('new user inserted into user table')
            }
        })
        connection.query(`INSERT INTO user (rangeName, email, password, ID) VALUES (?,?,?,?)`, ['Bow Shop', 'a', 'a', Date.now() + Math.random().toString(36).substring(7)], err => {
            if (err) {
                console.log(err)
                throw new Error()
            } else {
                console.log('new user inserted into user table')
            }
        })
        connection.query(`INSERT INTO gameMode (name, description, scoreableVals, xVal, apr, rpb, bpg, maxScore) VALUES (?,?,?,?,?,?,?,?)`, ['NFAA 5 Spot', 'Standard NFAA 5 Spot 300 Round', JSON.stringify(['x',5,4,3,2,1,0]), 5, 5, 4, 3, 300], err => {
            if (err) {
                console.log(err)
                throw new Error()
            } else {
                console.log('new gamemode inserted into gameMode table')
            }
        })
        connection.query(`INSERT INTO gameMode (name, description, scoreableVals, xVal, apr, rpb, bpg, maxScore) VALUES (?,?,?,?,?,?,?,?)`, ['NFAA Vegas Round', 'Standard Vegas 3 Spot 300 Round', JSON.stringify(['x',10,9,8,7,6,5,4,3,2,1,0]), 10, 3, 5, 2, 300], err => {
            if (err) {
                console.log(err)
                throw new Error()
            } else {
                console.log('new gamemode inserted into gameMode table')
            }
        })
    } catch (e) {

    }

}

seed()


connection.end();