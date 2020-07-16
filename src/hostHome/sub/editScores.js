import React from 'react'

const EditScores = props => {
    const scoreFields = () => {
        let rounds = props.rounds
        let archers = props.archers
        let gameModes = props.gameModes
        let scedule = props.scedule
        scedule = scedule.slice(0,props.durationCompleted)
        let teams = props.roster
        let roster = props.roster
        teams = teams.map(team => team.teamName)
        return scedule.map(gameModeID => {
            let currentGameMode = gameModes.filter(gameMode => gameMode.ID === gameModeID)
            currentGameMode = currentGameMode[0]
            return roster.map(team => {
                return team.member.map(archer => {
                    let feildList = []
                    
                })
            })
        })
    }
    return (
        <div className="editScores">
            Edit Scores
        </div>
    )
}

export default EditScores