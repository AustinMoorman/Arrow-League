import React, {useEffect} from 'react'
import './score.css'
import GroupScores from './sub/groupScores'
import CurrentScore from './sub/currentScore'

const Score = props => {
    useEffect(() => {
        const scoring = props.scoring
        const rounds = props.rounds
        scoring.forEach((archer, index) => {

            const archersRounds = rounds.filter(round => round.archerID === archer.ID) || []
            let total = 0
            let currentRound = 1
            let totalXCount = 0
            archersRounds.forEach(round => {
                total = total + round.total
                currentRound++
                totalXCount = totalXCount + round.xCount
            })
            const lastRound = archersRounds.find(round => round.round === (currentRound - 1)) || {}

            scoring[index].score = lastRound.total || 0
            scoring[index].scoreXCount = lastRound.xCount || 0
            scoring[index].total = total
            scoring[index].totalXCount = totalXCount
            if (currentRound > (props.gameMode.bpg * props.gameMode.rpb)) {
                scoring[index].currentRound = 'finished'
                if (props.currentlyScoring.archerID === archer.ID) {
                    nextArcher(props.currentlyScoring.index)
                }
            } else {
                scoring[index].currentRound = currentRound
            }
        })
        props.gameOnChange({ target: { name: 'scoring', value: scoring } })
    }, [props.rounds])

    useEffect(() => {
        nextArcher(-1)
    }, [])
    useEffect(() => {
        return () => {
            props.gameOnChange({ target: { name: 'currentlyScoring', value: {scores:[]} } })
            }
      }, []);
    const nextArcher = index => {
        const scoring = props.scoring || [{}]
        let nextID
        for (let i = 0; i < scoring.length && !nextID; i++) {
            index++
            if (index >= scoring.length) {
                index = 0
            }
            if (scoring[index].currentRound !== 'finished') {
                nextID = scoring[index].ID
            }
        }
        if (!nextID) {
            return
        } else {
            const currentlyScoring = { archerID: nextID, index, scores: [] }
            props.gameOnChange({ target: { name: 'currentlyScoring', value: currentlyScoring } })
        }
    }
    return (
        <div className="score">
            <h3>{props.gameMode.name}</h3>
            <GroupScores scoring={props.scoring} currentlyScoring={props.currentlyScoring} gameOnChange={props.gameOnChange}/>
            <CurrentScore scoring={props.scoring} currentlyScoring={props.currentlyScoring} gameMode={props.gameMode} nextArcher={nextArcher} setHeadError={props.setHeadError} gameOnChange={props.gameOnChange} accessCode={props.accessCode} freeScoring={props.freeScoring}/>

        </div>
    )
}

export default Score