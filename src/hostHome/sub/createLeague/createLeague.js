import React, { useEffect } from 'react'
import './createLeague.css'
import Basic from '../basic'
import Handicap from '../handicap'
import Schedule from '../schedule'
import Roster from '../roster'
import SelectScorer from '../selectScorer'

const axios = require('axios').default;
axios.defaults.withCredentials = true;



function CreateLeague(props) {

    const setUp = () => {
        props.setHeadError('')
        axios.get(`${process.env.REACT_APP_EXPRESS_URL}/api/auth/league/get-game-modes`).then(response => {
            let e = {
                target: {
                    value: response.data,
                    name: 'gameModes'
                }
            }
            props.leagueOnChange(e)
            props.defaultCreateLeague(response.data[0].ID)

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
        let league = props.league
        let roster = league.roster
        let mistake
        let approved = true

        let teamNames = []
        let archerNames = []
        let archerScorer = []
        roster.forEach((team, teamIndex) => {
            if (team.teamName) {
                roster[teamIndex].teamName = team.teamName.trim()
                teamNames.push(team.teamName.trim())
            }
            team.member.forEach((archer, archerIndex) => {
                roster[teamIndex].member[archerIndex].name = archer.name.trim()
                archerNames.push(archer.name.trim())
                if (archer.scorer || archer.scorer === 0) {
                    archerScorer.push(archer.scorer)
                }
            })
        })

        let scorerNames = []
        if (league.freeScoring == 'false') {
            league.scorers.forEach((scorer, index) => {
                league.scorers[index].name = scorer.name.trim()
                scorerNames.push(scorer.name.trim())
            })
        }





        const teamNameSet = new Set(teamNames)
        const archerNameSet = new Set(archerNames)
        const scorerNameSet = new Set(scorerNames)
        if (league.freeScoring == 'false' && archerScorer.length !== archerNames.length) {
            approved = false
            mistake = `All archers need to be assigned to a scorer.`
        }
        if (league.freeScoring == "false" && scorerNameSet.size !== scorerNames.length) {
            approved = false
            mistake = 'All scorer names must be unique.'
        }
        if (league.team === 'team' && teamNameSet.size !== teamNames.length) {
            approved = false
            mistake = 'All team names must be unique.'
        }
        if (archerNameSet.size !== archerNames.length) {
            approved = false
            mistake = 'All archer names must be unique.'
        }
        league.roster = roster

        if (approved) {
            axios.post(`${process.env.REACT_APP_EXPRESS_URL}/api/auth/league/create-league`, { league }).then(response => {
                setUp()
                setMessage('New league sucessfully created!')
            }).catch(err => {
                props.setHeadError('There was a network error. Please try again.')
            })
        } else {
            setMessage(mistake)
        }


    }
    const setMessage = message => {
        props.leagueOnChange({ target: { name: 'message', value: message } })
    }


    return (
        <div className="createLeague">
            <div className="leagueInputs">
                <form onSubmit={submitLeague} onInvalid={setMessage.bind(this, 'Please make sure all entries are filled out.')}>
                    <Basic leagueOnChange={props.leagueOnChange} league={props.league} />
                    <Handicap leagueOnChange={props.leagueOnChange} league={props.league} />
                    <Schedule leagueOnChange={props.leagueOnChange} league={props.league} />
                    <Roster leagueOnChange={props.leagueOnChange} league={props.league} />
                    <SelectScorer leagueOnChange={props.leagueOnChange} league={props.league} />
                    <button type="submit" value="Submit">Create League</button>
                </form>
                <p>{props.league.message}</p>

            </div>
        </div>
    )
}
export default CreateLeague;