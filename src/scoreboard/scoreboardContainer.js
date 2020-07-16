import React, { useEffect } from 'react'
import { socket } from '../archerHome/socket'
import { connect } from "react-redux"
import { updateScoreboard } from '../actions/scoreboardActions'
import Scoreboard from './scoreboard'

const ScoreboardContainer = props => {
    useEffect(() => {
        socket.emit('Join Scoreboard', { scoreboardAccessCode: props.accessCode, gameID: props.gameID })
    }, [])
    useEffect(() => {
        return () => {
            socket.emit('Leave Scoreboard', props.accessCode)
        }
    }, []);
    useEffect(() => {
        props.updateScoreboard(teams())
    }, [props.rounds])

    const orderScoreboard = scoreboardArr => {
        scoreboardArr.sort((a, b) => {
            if (a.totalScore === b.totalScore) {
                return b.totalXCount - a.totalXCount
            } else {
                return b.totalScore - a.totalScore
            }
        })
        scoreboardArr.forEach((_team, index) => {
            scoreboardArr[index].archers.sort((a, b) => {
                if (a.totalScore === b.totalScore) {
                    return b.totalXCount - a.totalXCount
                } else {
                    return b.totalScore - a.totalScore
                }
            })
        })
        return scoreboardArr
    }
    const openScores = (archerID) => {
        let roster = props.roster
        let index = roster.findIndex(archer => archer.ID === archerID)
        roster[index].open = roster[index].open ? false : true
        props.gameOnChange({ target: { name: 'roster', value: roster } })
        props.updateScoreboard(teams())
    }

    const teams = () => {
        let roster = props.roster
        let rounds = props.rounds
        let teams = roster.map(archer => archer.team).filter((value, index, self) => self.indexOf(value) === index)
        let teamArr = []
        teams.forEach(team => {
            teamArr.push({ teamName: team, totalScore: 0, totalXCount: 0, archers: [] })
        })
        roster.forEach(archer => {
            let index = teamArr.findIndex(team => team.teamName === archer.team)
            teamArr[index].archers.push({ name: archer.name, archerID: archer.ID, open: archer.open, totalScore: 0, totalXCount: 0, roundsCompleted: 0, rounds: [] })
        })
        rounds.forEach(round => {
            let teamIndex = teamArr.findIndex(team => team.teamName === round.team)
            let archerIndex = teamArr[teamIndex].archers.findIndex(archer => archer.archerID === round.archerID)
            teamArr[teamIndex].totalScore += round.total
            teamArr[teamIndex].totalXCount += round.xCount
            teamArr[teamIndex].archers[archerIndex].totalScore += round.total
            teamArr[teamIndex].archers[archerIndex].totalXCount += round.xCount
            teamArr[teamIndex].archers[archerIndex].roundsCompleted++
            teamArr[teamIndex].archers[archerIndex].rounds.push({ round: round.round, total: round.total, xCount: round.xCount, arrows: round.arrows })
        })
        return orderScoreboard(teamArr)
    }
    if (props.scoreboard.length) {
        return (
            <div className="scoreboard">
                <h3>{props.gameMode.name}</h3>
                <Scoreboard scoreboard={props.scoreboard} gameMode={props.gameMode} openScores={openScores}/>
            </div>
        )
    }else{
        return (
            <div>
                loading
            </div>
        )
    }



}
const mapStateToProps = state => {
    return {
        scoreboard: state.scoreboard
    }
}

const mapDispatchToProps = dispatch => {
    return {
        updateScoreboard: scoreboardArr => {
            dispatch(updateScoreboard(scoreboardArr))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ScoreboardContainer)
