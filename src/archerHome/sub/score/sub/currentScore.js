import React from 'react'
import { socket } from '../../../socket'

const CurrentScore = props => {
    const deleteScore = index => {
        let currentlyScoring = props.currentlyScoring
        currentlyScoring.scores.splice(index, 1)
        props.gameOnChange({ target: { name: 'currentlyScoring', value: currentlyScoring } })
    }
    const addToCurrentScore = (value) => {
        let currentlyScoring = props.currentlyScoring || { scores: [] }
        if (currentlyScoring.scores.length < props.gameMode.apr) {
            currentlyScoring.scores.push(value)
        }
        props.gameOnChange({ target: { name: 'currentlyScoring', value: currentlyScoring } })
    }
    const saveAndNext = async (currentlyScoring) => {
        props.setHeadError('')
        let scoring = props.scoring
        let currentRound
        let currentScoringIndex
        scoring.forEach((archer, index) => {
            if (archer.ID === currentlyScoring.archerID) {
                currentRound = archer.currentRound
                currentScoringIndex = index
                currentlyScoring.team = archer.team
            }
        })
        currentlyScoring.round = currentRound
        currentlyScoring.total = 0
        currentlyScoring.xCount = 0
        currentlyScoring.scores.forEach(arrow => {
            if (arrow === 'x') {
                currentlyScoring.xCount++
                currentlyScoring.total += props.gameMode.xVal
            } else {
                currentlyScoring.total += arrow
            }
        })
        try {
            socket.emit('Add Score', currentlyScoring, props.accessCode, props.freeScoring)
            props.gameOnChange({ target: { name: 'currentlyScoring', value: currentlyScoring } })
            props.nextArcher(currentScoringIndex)

        } catch (error) {
            props.setHeadError('Network Error. Please try again.')
        }

    }

    if (props.scoring.length) {
        const scoreableVals = props.gameMode.scoreableVals || []
        let currentlyScoring = props.currentlyScoring || { scores: [] }
        currentlyScoring.index = currentlyScoring.index || 0
        if (props.scoring[currentlyScoring.index].currentRound === 'finished') {
            return <div><h3>Congratulations! You are done scoring!</h3></div>
        } else {
            let scoreDisplay = []
            for (let i = 0; i < props.gameMode.apr; i++) {
                const score = currentlyScoring.scores[i]
                scoreDisplay.push(
                    <div className="scoringScoreDisplay" onClick={deleteScore.bind(this, i)}>
                        <p>{score}</p>
                    </div>
                )
            }
            let scoreButtons = scoreableVals.map(val => {
                return <button disabled={true}>{val}</button>
            })
            if (currentlyScoring.archerID || currentlyScoring.archerID === 0) {
                scoreButtons = scoreableVals.map(val => {
                    return <button onClick={addToCurrentScore.bind(this, val)}>{val}</button>
                })
            }

            let save = <button disabled={true}>Save {'&'} Next</button>
            if (currentlyScoring.scores.length === props.gameMode.apr) {
                save = <button onClick={saveAndNext.bind(this, currentlyScoring)}>Save {'&'} Next</button>
            }

            return (
                <div>
                    {scoreDisplay}
            -----------------
                    {scoreButtons}
                    {save}
                </div>
            )
        }
    }


}

export default CurrentScore