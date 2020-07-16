import React, { useEffect } from 'react'
import './runLeague.css'

const axios = require('axios').default;
axios.defaults.withCredentials = true;

const RunLeague = props => {

    const setUp = () => {
        props.setHeadError('')
        axios.get(`${process.env.REACT_APP_EXPRESS_URL}/api/auth/league/get-all-leagues`)
            .then(response => {
                let leagues = response.data.leagues
                props.setLeagues(leagues)
            }).catch(err => {
                console.log(err)
                props.setHeadError('There was a network error. Please try again.')
            })
    }

    useEffect(() => {
        setUp()
    }, [])

    const handleRunLeague = (index) => {
        const confirmation = window.confirm('Are you sure you want to start the event now?')
        if (confirmation) {
            props.setHeadError('')
            axios.post(`${process.env.REACT_APP_EXPRESS_URL}/api/auth/league/run-league`, { leagueID: props.leagues[index].ID, eventIndex: props.leagues[index].durationCompleted + 1, gameModeID: props.leagues[index].schedule[props.leagues[index].durationCompleted], freeScoring: props.leagues[index].freeScoring, scorers: props.leagues[index].scorers })
                .then(response => {
                    setUp()
                }).catch(err => {
                    console.log(err)
                    props.setHeadError('There was a network error. Please try again.')
                })

        }

    }
    const handleStatusChange = (index, status) => {
        console.log(status)
        let message
        if (status == 'ended') { message = 'Are you sure you want to end the event now? There is no going back.' }
        if (status == 'pause') { message = 'Are you sure you want to pause the event? No one will be able to enter scores.' }
        if (status == 'active') { message = 'Are you sure you want to unpause the event?' }
        const confirmation = window.confirm(message)
        if (confirmation) {
            props.setHeadError('')
            axios.put(`${process.env.REACT_APP_EXPRESS_URL}/api/auth/league/change-league-status`, { accessCode: props.leagues[index].accessCode, status, leagueID: props.leagues[index].ID, durationCompleted: props.leagues[index].durationCompleted })
                .then(response => {
                    setUp()
                }).catch(err => {
                    console.log(err)
                    props.setHeadError('There was a network error. Please try again.')
                })
        }


    }

    const changeAccessCode = (index) => {
        const confirmation = window.confirm('Are you sure you want to reset the access code? This will disconnect everyone.')
        if (confirmation) {
            props.setHeadError('')
            axios.post(`${process.env.REACT_APP_EXPRESS_URL}/api/auth/league/change-access-code`, { accessCode: props.leagues[index].accessCode })
                .then(response => {
                    setUp()
                }).catch(err => {
                    console.log(err)
                    props.setHeadError('There was a network error. Please try again.')
                })
        }


    }
    const changeScorerCode = (scorerCode) => {
        const confirmation = window.confirm('Are you sure you want to reset this scorer code? This will disconnect this scorer.')
        if (confirmation) {
            props.setHeadError('')
            axios.post(`${process.env.REACT_APP_EXPRESS_URL}/api/auth/league/change-scorer-code`, { scorerCode })
                .then(response => {
                    setUp()
                }).catch(err => {
                    console.log(err)
                    props.setHeadError('There was a network error. Please try again.')
                })
        }


    }

    const leagues = () => {
        let leagueArr = props.leagues
        return leagueArr.map((league, index) => {
            if (league.durationCompleted < league.duration) {
                let scorers
                let gameMode= league.gameModes.filter(gamemode => {
                   return gamemode.ID === league.schedule[league.durationCompleted]})
                gameMode = gameMode[0]
                if (!league.freeScoring) {
                    scorers = league.scorers.map(scorer => {
                        return (
                            <div>
                                <p>{`Scorer: ${scorer.name}`}</p>
                                <p>{`Scorer Code: ${scorer.scorerCode}`}</p>
                                <button onClick={changeScorerCode.bind(this, scorer.scorerCode)}>Change Scorer Code</button>
                            </div>
                        )
                    })
                }
                if (league.status == 'active') {

                    return (
                        <div className="leagueLi">
                            <p>{league.leagueName}</p>
                            <p>completed: {`${league.durationCompleted}/${league.duration}`}</p>
                            <p>Game mode: {gameMode.name}</p>
                            <p>{league.team}</p>
                            <p>Access Code: {league.accessCode}</p>
                            <p>Scoreboard Access Code: {league.scoreboardAccessCode}</p>
                            {scorers}
                            <button onClick={changeAccessCode.bind(this, index)}>Reset Access Code</button>
                            <button onClick={e => { handleStatusChange(index, 'pause') }}>Pause Event</button>
                            <button onClick={e => { handleStatusChange(index, 'ended') }}>End Event {league.durationCompleted + 1}</button>
                        </div>
                    )
                } else if (league.status == 'pause') {
                    return (
                        <div className="leagueLi">
                            <p>{league.leagueName}</p>
                            <p>completed: {`${league.durationCompleted}/${league.duration}`}</p>
                            <p>Game mode: {gameMode.name}</p>
                            <p>{league.team}</p>
                            <p>Access Code: {league.accessCode}</p>
                            <p>Scoreboard Access Code: {league.scoreboardAccessCode}</p>
                            {scorers}
                            <button onClick={changeAccessCode.bind(this, index)}>Reset Access Code</button>
                            <button onClick={e => { handleStatusChange(index, 'active') }}>Unpause Event</button>
                            <button onClick={e => { handleStatusChange(index, 'ended') }}>End Event {league.durationCompleted + 1}</button>
                        </div>
                    )
                } else {
                    return (
                        <div className="leagueLi">
                            <p>{league.leagueName}</p>
                            <p>completed: {`${league.durationCompleted}/${league.duration}`}</p>
                            <p>Game mode: {gameMode.name}</p>
                            <p>{league.team}</p>
                            <button onClick={handleRunLeague.bind(this, index)}>Run Event {league.durationCompleted + 1}</button>
                        </div>
                    )
                }
            }

        })
    }



    return (
        <div className="runLeague">
            {leagues()}
        </div>
    )
}

export default RunLeague