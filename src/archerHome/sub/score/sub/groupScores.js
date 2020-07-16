import React from 'react'

const GroupScores = props => {

    const selectArcher = (archerID, index) => {
        let confirmation = true
        if (props.currentlyScoring.scores.length) {
            confirmation = window.confirm('Are you sure you want to switch archers without saving their score?')
        }
        if (confirmation) {
            let currentlyScoring = {
                scores: [],
                archerID,
                index
            }
            props.gameOnChange({ target: { name: 'currentlyScoring', value: currentlyScoring } })
        }
    }
        const scoring = props.scoring
        return scoring.map((archer, index) => {
            let className = 'scoreArcher unselected'
            if (archer.currentRound === 'finished') {
                return (
                    <div className={className}>
                        <p>{archer.name}</p>
                        <p>Finished</p>
                        <p>Total:{archer.total} / {archer.totalXCount}x</p>
                        <p>----------------------------------------</p>

                    </div>
                )
            } else {
                if (props.currentlyScoring.archerID == archer.ID) {
                    className = 'scoreArcher selected'
                }
                return (
                    <div className={className} onClick={selectArcher.bind(this, archer.ID, index)}>
                        <p>{archer.name}</p>
                        <p>Current Round: {archer.currentRound}</p>
                        <p>Last Score:{archer.score} / {archer.scoreXCount}x</p>
                        <p>Total:{archer.total} / {archer.totalXCount}x</p>
                        <p>----------------------------------------</p>

                    </div>
                )
            }
        })
}

export default GroupScores