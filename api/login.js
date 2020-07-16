const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const loginRouter = express.Router()
const db = require('../db/db')

const {resetPasswordEmail} = require('./email')

loginRouter.post('/', async(req,res,next) => {
    let reqUserEmail = req.body.user.email
    reqUserEmail.toLowerCase()

    let reqUserPassword = req.body.user.password
    let user;

    try {
        user = await db.userDB.get(reqUserEmail)
        if(user){
            //const match = await bcrypt.compare(reqUserPassword, user.password)
            const match = reqUserPassword === user.password
            const minutes = await db.userDB.logInAttempt(reqUserEmail,match)
            if(minutes === 0){
                if(match){
                const token = jwt.sign({
                    expiresIn: "2 days",
                    data: {email: user.email, ID: user.ID, type: 'Host'}
                }, process.env.JWT_SECRET)
                const cookieOptions = { 
                    httpOnly: true, 
                    expires: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), 
                    sameSite: process.env.SAMESITE
                }
                console.log(token)
                res.cookie('UserAccess', token, cookieOptions).json({email: user.email, rangeName: user.rangeName, type: 'Host', message: 'Log in successful'}).status(200)
            }else{
                res.status(401).json({ message: 'Password is incorrect' }) 
            }
            }else{
                res.status(401).json({ message: `Too many failed login attempts. Try again in ${minutes} minutes or reset your password.` })
            }
            
    
        }else{
            res.status(401).json({ message: 'No account with that email' })
        }

    } catch(e) {
        next(e)
    }
})


loginRouter.post('/send_reset_code', async(req, res, next) => {
    let reqUserEmail = req.body.email
    reqUserEmail.toLowerCase()

    let user;

    try {
        user = await db.userDB.get(reqUserEmail)
        if(user){
            const resetCode = require('crypto').randomBytes(4).toString('hex')
            console.log(resetCode)
            await resetPasswordEmail(user.email, user.rangeName,resetCode)
            db.userDB.addResetCode(user.ID,resetCode)
            res.status(200).json({message: 'Check your email for an 8 character reset code and then enter below. Do not leave his page.'})
        }else{
            res.status(401).json({message: 'No user with that email. Try a different email or contact us.'})
        }
    }catch(e){
        next(e)
    }

})
loginRouter.post('/reset_password', async (req,res,next) => {
    const reqUser = req.body.user
    reqUser.forgottenEmail.toLowerCase()
    //reqUser.resetPassword = await bcrypt.hash(reqUser.resetPassword, 10)
    try {
        const dbRes = await db.userDB.changePassword(reqUser.forgottenEmail,reqUser.resetPassword, reqUser.resetCode)
        console.log(dbRes)
        if(dbRes == 'Success'){
            res.status(200).json({message: 'Password successfully reset! You can login now.'})
        }else if(dbRes == 'Timed Out'){
            res.status(401).json({message: 'Reset code incorrect or expired. Try resetting your password again.'})
        }else{
            res.status(401).json({message: 'Reset failed. Please make sure your email and reset code are correct.'})
        }

    }catch(e){
        next(e)
    }
})

loginRouter.delete('/', (req, res, next) => {
    res.clearCookie('UserAccess').send()
})


module.exports = loginRouter
