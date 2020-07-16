const express = require('express')

const leagueRouter = express.Router()

const db = require('../db/db')

const createEditLeagueRouter = require('./createEditLeague')

leagueRouter.get('/get-game-modes', async (req, res, next) => {
    try {
        const gameModes = await db.leagueDB.getGameModes(req.user.email)
        res.status(200).json(gameModes)

    } catch (err) {
        next(err)
    }
})

leagueRouter.get('/get-all-leagues', async (req, res, next) => {
    try {
        let leagues = await db.leagueDB.getAllLeagues(req.user.ID)
        const gameModes = await db.leagueDB.getGameModes(req.user.email)
        for (let i = 0; i < leagues.length; i++) {
            let archers = await db.archerDB.getArchers(leagues[i].ID)
            let rounds = await db.roundDB.getRoundsByLeagueID(leagues[i].ID)
            rounds.forEach((round, index) => {
                rounds[index].arrows = JSON.parse(round.arrows)
            })
            const game = await db.leagueDB.gameStatus(leagues[i].ID, leagues[i].durationCompleted + 1)
            let scorers
            if (!leagues[i].freeScoring) {
                scorers = await db.leagueDB.getScorersByAccessCode(game.accessCode)
                if(!scorers.length){
                    scorers = JSON.parse(leagues[i].scorers)
                }
            }
            leagues[i].archers = archers
            leagues[i].rounds = rounds
            leagues[i].gameModes = gameModes
            leagues[i].collapsed = true
            leagues[i].schedule = JSON.parse(leagues[i].schedule)
            leagues[i].status = game.status
            leagues[i].accessCode = game.accessCode
            leagues[i].scoreboardAccessCode = game.scoreboardAccessCode
            leagues[i].scorers = scorers


        }
        res.status(200).json({ leagues })
    } catch (err) {
        next(err)
    }
})
leagueRouter.post('/run-league', async (req, res, next) => {
    try {
        console.log(req.body)
        const createAccessCode = async () => {
            let accessCode = require('crypto').randomBytes(3).toString('hex')
            let match = await db.leagueDB.checkAccessCode(accessCode)
            while (match == true) {
                accessCode = require('crypto').randomBytes(3).toString('hex')
                match = await db.leagueDB.checkAccessCode(accessCode)
            }
            return accessCode
        }
        let accCode = await createAccessCode()
        let scoreBoardCode = await createAccessCode()
        await db.leagueDB.runLeague(req.body.leagueID, req.user.ID, accCode, req.body.eventIndex, req.body.gameModeID, scoreBoardCode)
        if (req.body.freeScoring == 0 || !req.body.freeScoring) {
            let scorers = req.body.scorers
            scorers.forEach(async (scorer, index) => {
                let scorerCode = await createAccessCode()
                await db.leagueDB.addFixedScorer(scorer, accCode, scorerCode, index)
                scorers[index].scorerCode = scorerCode
            })
            res.sendStatus(200)
        } else {
            res.sendStatus(200)
        }
    } catch (e) {
        next(e)
    }



})

leagueRouter.put('/change-league-status', async (req, res, next) => {
    await db.leagueDB.setStatus(req.body.accessCode, req.body.status)
    if (req.body.status == 'ended') {
        console.log(req.body)
        db.leagueDB.advanceLeague(req.body.leagueID, req.body.durationCompleted + 1)
    }
    res.sendStatus(200)
})


leagueRouter.post('/change-access-code', async (req, res, next) => {
    let accessCode = require('crypto').randomBytes(3).toString('hex')
    let match = await db.leagueDB.checkAccessCode(accessCode)
    while (match == true) {
        accessCode = require('crypto').randomBytes(3).toString('hex')
        match = await db.leagueDB.checkAccessCode(accessCode)
    }
    await db.leagueDB.changeAccessCode(req.body.accessCode, accessCode)

    res.status(200).json({ accessCode })
})

leagueRouter.post('/change-scorer-code', async (req, res, next) => {
    let scorerCode = require('crypto').randomBytes(3).toString('hex')
    let match = await db.leagueDB.checkAccessCode(scorerCode)
    while (match == true) {
        scorerCode = require('crypto').randomBytes(3).toString('hex')
        match = await db.leagueDB.checkAccessCode(scorerCode)
    }
    await db.leagueDB.changeScorerCode(req.body.scorerCode, scorerCode)

    res.status(200).json({ scorerCode })
})



leagueRouter.use('/create-league', createEditLeagueRouter)




module.exports = leagueRouter;
