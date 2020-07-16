import React, { useEffect } from 'react'

const SelectScorer = props => {


    const scorerNameChange = (e, index) => {
        let scorers = props.league.scorers
        scorers[index].name = e.target.value
        props.leagueOnChange({ target: { name: 'scorers', value: scorers } })
    }
    const handleAddScorer = () => {
        let scorers = props.league.scorers
        scorers.push({})
        props.leagueOnChange({ target: { name: 'scorers', value: scorers } })
    }
    const removeScorer = index => {
        let scorers = props.league.scorers
        scorers.splice(index, 1)
        props.leagueOnChange({ target: { name: 'scorers', value: scorers } })
    }
    const removeArcher = (teamIndex, archerIndex) => {
        let roster = props.league.roster
        roster[teamIndex].member[archerIndex].scorer = null
        props.leagueOnChange({ target: { name: 'roster', value: roster } })
    }
    const addArcher = event => {
        let scorerIndex = Number(event.target.id)
        let aTIndex = props.league.drag
        let roster = props.league.roster
        roster[aTIndex.teamIndex].member[aTIndex.archerIndex].scorer = scorerIndex
        props.leagueOnChange({ target: { name: 'roster', value: roster } })
        props.leagueOnChange({ target: { name: 'drag', value: {} } })
    }
    const dragOver = event => {
        event.preventDefault()
    }
    const dragStart = event => {
        const drag = JSON.parse(event.target.id)

        props.leagueOnChange({ target: { name: 'drag', value: drag } })
    }

    let scorerOptions
    let addScorer
    let notScoring
    if (props.league.freeScoring === 'false') {
        let scorers = props.league.scorers
        let roster = props.league.roster
        scorerOptions = scorers.map((scorer, index) => {

            let scoring = roster.map((team, teamIndex) => {
                return team.member.map((archer, archerIndex) => {
                    if (archer.scorer === index) {
                        return (
                            <div>
                                <p>{archer.name}</p>
                                <button onClick={removeArcher.bind(this, teamIndex, archerIndex)}>-</button>
                            </div>
                        )
                    }
                })
            })

            let deleteButton
            if (index > 0) {
                deleteButton = <button onClick={removeScorer.bind(this, index)}>-</button>
            }
            return (
                <div className="scorer">
                    <input type="text" value={props.league.scorers[index].name} onChange={e => { scorerNameChange(e, index) }} required={true}></input>
                    <div className="dragBox" id={index} onDrop={addArcher} onDragOver={dragOver}>
                        {scoring}
                        <p>Drag archers here.</p>
                    </div>
                    
                    {deleteButton}
                </div>
            )
        })
        addScorer = <button onClick={handleAddScorer}>+</button>
        notScoring = roster.map((team,teamIndex) => {
            return team.member.map((archer,archerIndex) => {
                if(!archer.scorer && archer.scorer !== 0){
                    return (
                        <div draggable={true} id={JSON.stringify({teamIndex,archerIndex})} onDragStart={dragStart}>
                            <p>{archer.name}</p>
                        </div>
                    )
                }
            })
        })
    }
    return (
        <div>
            <label>Free Scoring:</label>
            <input type="radio" name="freeScoring" onChange={props.leagueOnChange} checked={props.league.freeScoring == "true" || props.league.freeScoring == 1} value={true}></input>
            <label>Yes</label>
            <p>Anyone with an access code will be able to score.</p>
            <input type="radio" name="freeScoring" onChange={props.leagueOnChange} checked={props.league.freeScoring == "false" || props.league.freeScoring == 0} value={false}></input>
            <label>No</label>
            <p>You will assign who scores who.</p>
            {notScoring}
            {scorerOptions}
            {addScorer}
        </div>
    )
}

export default SelectScorer