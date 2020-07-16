import React, { useEffect } from 'react'
import './editLeague.css'
import Basic from '../basic'
import Handicap from '../handicap'
import Schedule from '../schedule'
import Roster from '../roster'
import EditScores from '../editScores'
import { resolveContent } from 'nodemailer/lib/shared'

const axios = require('axios').default;
axios.defaults.withCredentials = true;



function EditLeague(props) {
    const createRosters = leagues => {
        leagues.forEach((league, leagueIndex) => {
            if (league.team === 'team') {
                let roster = league.archers.map(archer => archer.team).filter((value, index, self) => self.indexOf(value) === index)
                roster = roster.map((team, index) => {
                    return { member: [], teamName: team, number: index }
                })
                league.archers.forEach(archer => {
                    let teamIndex = roster.findIndex(team => {
                        return team.teamName === archer.team
                    })
                    archer.number = roster[teamIndex].member.length
                    roster[teamIndex].member.push(archer)
                })
                leagues[leagueIndex].roster = roster
            }else{
                let roster = league.archers.map((archer,archerIndex) => {
                    return {member: [{name: archer.name, number: 0}], number: archerIndex, teamName: ""}
                })
                leagues[leagueIndex].roster = roster
            }
        })
        return leagues

    }

    const setUp = () => {
        props.setHeadError('')
        axios.get(`${process.env.REACT_APP_EXPRESS_URL}/api/auth/league/get-all-leagues`)
            .then(response => {
                let leagues = response.data.leagues
                leagues = createRosters(leagues)
                props.setLeagues(leagues)
            }).catch(err => {
                console.log(err)
                props.setHeadError('There was a network error. Please try again.')
            })
    }

    useEffect(() => {
        setUp()
    }, [])

    const submitLeague = e => {
        setMessage('Creating new league...')
        e.preventDefault()
        axios.post(`${process.env.REACT_APP_EXPRESS_URL}/api/auth/league/create-league`, { league: props.league }).then(response => {
            setUp()
            setMessage('New league sucessfully created!')
        }).catch(err => {
            props.setHeadError('There was a network error. Please try again.')
        })
    }
    const setMessage = message => {
        props.leagueOnChange({ target: { name: 'message', value: message } })
    }
    const saveEdits = index => {
        return
    }
    const leaguesList = () => {
        let leagueArr = props.leagues
        return leagueArr.map((league, index) => {
            if (league.collapsed == 'true' || league.collapsed == true) {
                return (
                    <div className="league collapsed">
                        <p>{league.leagueName}</p>
                        <p>completed: {`${league.durationCompleted}/${league.duration}`}</p>
                        <p>{league.team}</p>
                        <button name="collapsed" value={false} onClick={e => { props.leaguesOnChange(e, index) }}>Edit</button>
                    </div>
                )
            } else {
                return (
                    <div className="league edit">
                        <form onSubmit={saveEdits.bind(this, index)} onInvalid={setMessage.bind(this, 'Please make sure all entries are filled out.')}>
                            <Basic leagueOnChange={e => { props.leaguesOnChange(e, index) }} league={league} />
                            <Handicap leagueOnChange={e => { props.leaguesOnChange(e, index) }} league={league} />
                            <Schedule leagueOnChange={e => { props.leaguesOnChange(e, index) }} league={league} />
                            <Roster leagueOnChange={e => { props.leaguesOnChange(e, index) }} league={league} />
                            <EditScores leagueOnChange={e => { props.leaguesOnChange(e, index) }} rounds={league.rounds} archers={league.archers} roster={league.roster} team={league.team} durationCompleted={league.durationCompleted} gameModes={league.gameModes} schedule={league.schedule} />
                            <button type="submit" value="Submit">Save Edits</button>
                        </form>
                    </div>
                )
            }
        })
    }


    return (
        <div className="editLeague">
            {leaguesList()}
        </div>
    )
}
export default EditLeague;