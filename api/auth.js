const express = require('express')

const authRouter = express.Router()

const jwt = require('jsonwebtoken')
require('dotenv').config()

const db = require('../db/db')

const getHost = async (req, res, next) => {
    try {
        const dbUser = await db.userDB.get(req.user.email)
        if (dbUser) {
            req.user = dbUser
            req.user.type = 'Host'
            next()
        } else {
            res.sendStatus(401)
        }
    } catch (error) {
        console.log(error)
        res.sendStatus(500)
    }
}
const checkHost = (req, res, next) => {
    if (req.user.type == 'Host') {
        next()
    } else {
        res.sendStatus(401).json({ message: 'token not for host account' })
    }
}
const getArcher = async (req, res, next) => {
    try {
        const scorer = await db.leagueDB.getScorerByScorerCode(req.user.accessCode)
        if (scorer) {
            const game = await db.leagueDB.getGame(scorer.accessCode)
            res.status(200).json({ game: { leagueID: game.leagueID, accessCode: scorer.scorerCode, type: 'Archer', gameID: game.ID, scorerIndex: scorer.scorerIndex, scoreboardAccessCode: game.scoreboardAccessCode, freeScoring: false} })
        } else {
            const game = await db.leagueDB.getGame(req.user.accessCode)
            const scorerID = await db.archerDB.createScorer(game.ID)
            res.status(200).json({ game: { leagueID: game.leagueID, accessCode: game.accessCode, type: 'Archer', scorerID, gameID: game.ID, scoreboardAccessCode: game.scoreboardAccessCode, freeScoring: true } })
        }
    } catch (e) {
        console.log(e)
        res.status(500).json({ message: 'Invalid code.' })
    }
}
const checkArcher = (req, res, next) => {
    if (req.user.type == 'Archer') {
        next()
    } else {
        res.sendStatus(401)
    }
}

const authenticate = (req, res, next) => {
    const token = req.cookies.UserAccess
    if (!token) {
        return res.status(401).json({ message: 'no token found' })
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'bad token' });
        }
        if (user.data) {
            if (user.data.type === 'Host') {
                req.user = user.data
                getHost(req, res, next)
            } else if (user.data.type === 'Archer') {
                req.user = user.data
                getArcher(req, res, next)
            }
        } else {
            res.sendStatus(401)
        }
    })

}
authRouter.post('/', authenticate, (req, res, next) => {
    const token = jwt.sign({
        expiresIn: "2 days",
        data: { email: req.user.email, ID: req.user.ID, type: 'Host' }
    }, process.env.JWT_SECRET)
    const cookieOptions = {
        httpOnly: true,
        expires: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        sameSite: process.env.SAMESITE
    }
    res.cookie('UserAccess', token, cookieOptions).json({ email: req.user.email, name: req.user.name, type: 'Host', message: 'token login successful' })

})

authRouter.post('/archer', async (req, res, next) => {
    try {
        const scorer = await db.leagueDB.getScorerByScorerCode(req.body.accessCode)
        const cookieOptions = {
            httpOnly: true,
            expires: new Date(Date.now() + 12 * 60 * 60 * 1000),
            sameSite: process.env.SAMESITE
        }
        if (scorer) {
            const game = await db.leagueDB.getGame(scorer.accessCode)
            const token = jwt.sign({
                expiresIn: "12 hours",
                data: { leagueID: game.leagueID, accessCode: scorer.scorerCode, type: 'Archer', gameID: game.ID }
            }, process.env.JWT_SECRET)
            res.cookie('UserAccess', token, cookieOptions).json({ game: { leagueID: game.leagueID, accessCode: scorer.scorerCode, scorerIndex: scorer.scorerIndex, type: 'Archer', gameID: game.ID, scoreboardAccessCode: game.scoreboardAccessCode, freeScoring: false} })
        } else {
            const game = await db.leagueDB.getGame(req.body.accessCode)
            const scorerID = await db.archerDB.createScorer(game.ID)
            const token = jwt.sign({
                expiresIn: "12 hours",
                data: { leagueID: game.leagueID, accessCode: game.accessCode, type: 'Archer', scorerID, gameID: game.ID }
            }, process.env.JWT_SECRET)
            res.cookie('UserAccess', token, cookieOptions).json({ game: { leagueID: game.leagueID, accessCode: game.accessCode, type: 'Archer', scorerID, scoreboardAccessCode: game.scoreboardAccessCode, gameID: game.ID, freeScoring: true } })
        }
    } catch (e) {
        console.log(e)
        res.status(500).json({ message: 'Invalid code.' })
    }


})

const leagueRouter = require('./league')

authRouter.use('/league', authenticate, checkHost, leagueRouter)

module.exports = authRouter;
