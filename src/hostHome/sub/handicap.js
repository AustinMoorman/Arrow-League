import React from 'react'

const Handicap = props => {
    let handicapOptions
    if (props.league.handicap == "true" || props.league.handicap == 1) {
        handicapOptions = (
            <div>
                <label>Handicap Max Score:</label>
                <input type="number" min="0" name="handicapMax" onChange={props.leagueOnChange} value={props.league.handicapMax} required></input>
                <label>Handicap Percentage:</label>
                <input type="number" min="1" max="100" name="handicapPercentage" onChange={props.leagueOnChange} value={props.league.handicapPercentage} required></input>
            </div>
        )
    }

    return (
        <div className="handicap">
            <label>Handicap:</label>
            <input type="radio" name="handicap" onChange={props.leagueOnChange} checked={props.league.handicap == "true" || props.league.handicap == 1} value={true}></input>
            <label>Yes</label>
            <input type="radio" name="handicap" onChange={props.leagueOnChange} checked={props.league.handicap == "false" || props.league.handicap == 0} value={false}></input>
            <label>No</label>
            {handicapOptions}
        </div>
    )

}

export default Handicap