import React from 'react'

const Basic = props => {
    return (
        <div className="basic">
            <label>League Name:</label>
            <input type="text" name="leagueName" onChange={props.leagueOnChange} value={props.league.leagueName} required></input>
            <label>Duration:</label>
            <input type="number" min="1" max="60" name="duration" onChange={props.leagueOnChange} value={props.league.duration} required></input>
        </div>
    )
}

export default Basic