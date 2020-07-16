import React, { useEffect } from 'react'
import './archerHome.css';
import { connect } from "react-redux"

import ScorerSelector from './sub/scorerSelector/scorerSelector'
import Score from './sub/score/score'
import ScoreboardContainer from '../scoreboard/scoreboardContainer'

import { socket } from './socket'

import { gameOnChange } from '../actions/archerActions'


function ArcherHome(props) {
    useEffect(() => {
        socket.emit('Join Room', props.user.game)
        socket.on('Roster', roster => {
            props.gameOnChange({ target: { name: 'roster', value: roster } })
        })
        socket.on('Rounds', rounds => {
            rounds.forEach(round => {
                round.arrows = JSON.parse(round.arrows)
            })
            props.gameOnChange({ target: { name: 'rounds', value: rounds } })
        })
        socket.on('Game Mode', gameMode => {
            let gameModeParsed = gameMode
            gameModeParsed.scoreableVals = JSON.parse(gameMode.scoreableVals)
            props.gameOnChange({ target: { name: 'gameMode', value: gameModeParsed } })
        })
        socket.on('Error',() => {
            props.setHeadError('Network Error. Please try again.')
        })
    }, [])

    switch (props.page) {
        case 'ScorerSelector':
            return (
                <ScorerSelector roster={props.archer.game.roster} scorerID={props.user.game.scorerID} leagueID={props.user.game.leagueID} accessCode={props.user.game.accessCode} scoring={props.archer.game.scoring} switchPage={props.switchPage} gameOnChange={props.gameOnChange} freeScoring={props.user.game.freeScoring} scorerIndex={props.user.game.scorerIndex} />
            )
            break;
        case 'Score':
            return (
                <Score scoring={props.archer.game.scoring} scorerID={props.user.game.scorerID} leagueID={props.user.game.leagueID} accessCode={props.user.game.accessCode} rounds={props.archer.game.rounds} currentlyScoring={props.archer.game.currentlyScoring} gameMode={props.archer.game.gameMode} gameOnChange={props.gameOnChange} setHeadError={props.setHeadError} switchPage={props.switchPage} freeScoring={props.user.game.freeScoring}/>
            )
        case 'Scoreboard':
            return (
                <ScoreboardContainer rounds={props.archer.game.rounds} roster={props.archer.game.roster} gameMode={props.archer.game.gameMode} accessCode={props.user.game.scoreboardAccessCode} gameID={props.user.game.gameID} setHeadError={props.setHeadError} gameOnChange={props.gameOnChange}/>
            )
        default:
            return (
                <div className="archerHome">
                    <h3>Archer Home</h3>
                    <button onClick={props.switchPage.bind(this, 'ScorerSelector')}>Score</button>
                    <p>OR</p>
                    <button onClick={props.switchPage.bind(this, 'Scoreboard')}>View Scores</button>
                </div>
            )
    }

}

const mapStateToProps = state => {
    return {
        archer: state.archer
    }
}

const mapDispatchToProps = dispatch => {
    return {
        gameOnChange: e => {
            dispatch(gameOnChange(e))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ArcherHome)