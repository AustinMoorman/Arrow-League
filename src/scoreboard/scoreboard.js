import React from 'react'



const Scoreboard = props => {
    let scoreboardArr = props.scoreboard
    let gameMode = props.gameMode

    return scoreboardArr.map((team, teamIndex) => {
        let archers = team.archers.map((archer, archerIndex) => {
            let lastRound = archer.rounds.filter(round => {
                return round.round === archer.roundsCompleted
            })
            lastRound = lastRound[0] || { arrows: [] }
            lastRound = lastRound.arrows.join(', ')
            let scores = archer.rounds.map(round => {
                    return (
                        <div>
                            <p>{`${round.round}: ${round.arrows.join(', ')}`}</p>
                        </div>
                    )
                })
            return (
                <div className="scoreboardElement archer">
                    <h5>{archerIndex + 1}: {archer.name}</h5>
                    <p>Rounds Completed: {archer.roundsCompleted} / {gameMode.bpg * gameMode.rpb}</p>
                    <p>Last Round: {lastRound}</p>
                    <p>Total: {archer.totalScore} / {archer.totalXCount}x</p>
                    <button onClick={props.openScores.bind(this, archer.archerID)}>Scores</button>
                    <div hidden={!archer.open}>
                       {scores}
                    </div>
                </div>
            )
        })
        let teamHead = (
            <div>
                <h4>{teamIndex + 1}: {team.teamName}</h4>
                <p>{team.totalScore} / {team.totalXCount}x</p>
            </div>
        )
        if (team.teamName === 'individual') {
            teamHead = null
        }
        return (
            <div className="scoreboardElement team">
                {teamHead}
                {archers}
            </div>
        )
    })
}

export default Scoreboard