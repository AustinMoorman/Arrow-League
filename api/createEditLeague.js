const express = require('express')

const createEditLeagueRouter = express.Router()

const db = require('../db/db')


createEditLeagueRouter.post('/', async (req, res, next) => {
    try {
        let reqLeague = req.body.league
        console.log(reqLeague)
        reqLeague.duration = Number(reqLeague.duration)
        reqLeague.handicap = (reqLeague.handicap == 'true')
        reqLeague.gameChanges = (reqLeague.leagueChanges == 'true')
        reqLeague.handicapPercentage = Number(reqLeague.handicapPercentage)
        reqLeague.handicapMax = Number(reqLeague.handicapMax)
        reqLeague.freeScoring = (reqLeague.freeScoring == 'true')
        if(reqLeague.freeScoring){
            reqLeague.scorers = null
        }


        let league = [
            Date.now(),
            req.user.ID,
            reqLeague.leagueName,
            reqLeague.duration,
            0,
            reqLeague.handicap,
            reqLeague.handicapPercentage || null,
            reqLeague.handicapMax || null,
            reqLeague.team,
            JSON.stringify(reqLeague.schedule),
            reqLeague.gameChanges,
            reqLeague.freeScoring,
            JSON.stringify(reqLeague.scorers)
        ]
    

        const leagueID = await db.leagueDB.addLeague(league)
        await db.archerDB.addArchers(reqLeague.roster, leagueID, reqLeague.team, reqLeague.freeScoring)
        res.sendStatus(200)
    } catch (err) {
        next(err)
    }
})

module.exports = createEditLeagueRouter