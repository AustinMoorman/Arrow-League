const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const registerRouter = express.Router()
const db = require('../db/db')
const {registrationEmail} = require('./email')

require('dotenv').config()

registerRouter.post('/', async(req,res,next) => {
    let reqUser = req.body.user
    reqUser.email.toLowerCase()
    let user;

    try {
        user = await db.userDB.get(reqUser.email)
        if(!user){
            reqUser.verificationCode = require('crypto').randomBytes(16).toString('hex')
            //reqUser.password = await bcrypt.hash(reqUser.password, 10)
            await db.userDB.create(reqUser)
            const emailRes = await registrationEmail(reqUser.email,reqUser.rangeName,reqUser.verificationCode)
            if(emailRes === 'OK'){
                res.status(200).json({message: 'Please go to your email to confirm your account.'})
            }
        }else{
            res.status(400).json({message: 'Email is already taken. Try logging in.'})
        }

    } catch(e) {
        next(e)
    }
})
registerRouter.get('/verification', async(req,res,next) => {
    try {
        const user = await db.userDB.get(req.query.email)
        if (user.verificationCode === req.query.verification_code){
            await db.userDB.verify(user.ID)
            res.redirect(`${process.env.APP_URL}/?new_registration=yes`)
        }else{
            res.redirect(`${process.env.APP_URL}/?new_registration=failed`)
        }
    } catch(e) {
        next(e)
    }
})
module.exports = registerRouter