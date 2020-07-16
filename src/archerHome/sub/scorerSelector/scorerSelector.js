import React, { useEffect } from 'react'
import { socket } from '../../socket'

const ScorerSelector = props => {
    useEffect(() => {
        if (!props.freeScoring) {
            let scoring = props.roster.filter(archer => {
                return archer.fixedScorerIndex === props.scorerIndex
            })
            props.gameOnChange({ target: { name: 'scoring', value: scoring } })
            props.switchPage('Score')
        }
    }, [])

    const addToScoring = archerID => {
        socket.emit('Add Scorer', { archerID: archerID, scorerID: props.scorerID, leagueID: props.leagueID, accessCode: props.accessCode })

    }
    const removeFromScoring = archerID => {
        socket.emit('Add Scorer', { archerID: archerID, scorerID: null, socketID: 'delete', leagueID: props.leagueID, accessCode: props.accessCode })

    }
    const roster = () => {
        const roster = props.roster
        return roster.map(archer => {
            if (!archer.scorerID || !archer.socketID) {
                return <button onClick={addToScoring.bind(this, archer.ID)}>{archer.name}</button>
            }
        })
    }
    const scoring = () => {
        const roster = props.roster
        return roster.map(archer => {
            if (archer.scorerID === props.scorerID && archer.socketID) {
                return <button onClick={removeFromScoring.bind(this, archer.ID)}>{archer.name}</button>
            }
        })

    }
    useEffect(() => {
        if (props.freeScoring) {
            let toBeScored = []
            const roster = props.roster
            roster.forEach(archer => {
                if (archer.scorerID === props.scorerID) {
                    toBeScored.push(archer)
                    if (!archer.socketID) {
                        socket.emit('Add Scorer', { archerID: archer.ID, scorerID: props.scorerID, leagueID: props.leagueID, accessCode: props.accessCode })
                    }
                }

            })
            props.gameOnChange({ target: { name: 'scoring', value: toBeScored } })
        }
    }, [props.roster])

    const startScoring = () => {
        if (props.scoring.length) {
            return <button onClick={props.switchPage.bind(this, 'Score')}>Start Scoring</button>
        }
        return
    }

    return (
        <div className="scorerSelector">
            <h3>pick who to score</h3>
            {roster()}
            <h3>you are scoring</h3>
            {scoring()}
            {startScoring()}
        </div>
    )
}

export default ScorerSelector