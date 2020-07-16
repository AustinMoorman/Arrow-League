const mysql = require('mysql');
require('dotenv').config()

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_DATABASE
});

const userDB = {}

userDB.get = (email) => {
    return new Promise((resolve, reject) => {
        connection.query('SELECT * FROM user WHERE email = ?', [email], (err, row) => {
            if (err) {
                return reject(err)
            }
            return resolve(row[0])
        })
    })
}
userDB.create = (newUser) => {
    return new Promise((resolve, reject) => {
        connection.query(`INSERT INTO user (rangeName, email, password, ID, verificationCode) VALUES (?,?,?,?,?)`, [newUser.rangeName, newUser.email, newUser.password, require('crypto').randomBytes(16).toString('hex') + Date.now(), newUser.verificationCode], (err, row) => {
            if (err) {
                return reject(err)
            }
            return resolve()
        })
    })
}
userDB.verify = (ID) => {
    return new Promise((resolve, reject) => {
        connection.query(`UPDATE user SET verified=TRUE WHERE ID=?`, [ID], (err, row) => {
            if (err) {
                return reject(err)
            }
            return resolve()
        })
    })
}
userDB.logInAttempt = (email, success) => {
    const time = Date.now() - (15 * 60 * 1000)
    return new Promise((resolve, reject) => {
        connection.query(`INSERT INTO loginAttempts (time, email, success) VALUES (?,?,?)`, [Date.now(), email, success], err => {
            if (err) {
                return reject(err)
            }
        })
        connection.query(`SELECT time FROM loginAttempts WHERE email = ? AND time > ? AND success = FALSE ORDER BY time DESC`, [email, time], (err, row) => {
            if (err) {
                return reject(err)
            }
            if (row.length > 4) {
                let minutes = (row[4].time - time) / (60 * 1000)
                minutes = Math.round(minutes)
                return resolve(minutes)
            } else {
                return resolve(0)
            }
        })
    })
}
userDB.addResetCode = (ID, resetCode) => {
    const date = Date.now()
    const fullResetCode = `${resetCode} ${date}`
    return new Promise((resolve, reject) => {
        connection.query(`UPDATE user SET resetCode=? WHERE ID=?`, [fullResetCode, ID], (err, row) => {
            if (err) {
                return reject(err)
            }
            return resolve()
        })

    })
}
userDB.changePassword = (email, newPassword, resetCode) => {
    return new Promise((resolve, reject) => {
        connection.query('SELECT * FROM user WHERE email=?', [email], (err, row) => {
            let user = row[0]
            if (user) {
                const resetCodeArr = user.resetCode.split(' ')
                const resetCreationTime = Number(resetCodeArr[1])

                if (resetCreationTime + (1000) > Date.now() && resetCode === resetCodeArr[0]) {
                    connection.query('UPDATE user SET password=?, resetCode=? WHERE email=?', [newPassword, null, email], err => {
                        if (err) {
                            return reject(err)
                        }
                        return resolve('Success')
                    })
                } else {
                    resolve('Timed Out')
                }
            } else {
                resolve('No User')
            }

        })
    })
}

module.exports = userDB