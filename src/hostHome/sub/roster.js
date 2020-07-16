import React from 'react'


const Roster = props => {

    const changeRoster = (e, team, archer) => {
        let roster = props.league.roster
        roster[team].member[archer].name = e.target.value
        props.leagueOnChange({ target: { name: 'roster', value: roster } })
    }
    const addRoster = () => {
        let roster = props.league.roster
        const number = roster.length
        roster.push({ number: number, member: [{ number: 0, name: '' }], teamName: '' })
        props.leagueOnChange({ target: { name: 'roster', value: roster } })
    }
    const changeTeamName = e => {
        let roster = props.league.roster
        const number = Number(e.target.name)
        roster[number].teamName = e.target.value
        props.leagueOnChange({ target: { name: 'roster', value: roster } })
    }
    const addArcher = (e) => {
        let roster = props.league.roster
        const teamNumber = Number(e.target.name)
        const archerNumber = roster[teamNumber].member.length
        roster[teamNumber].member.push({ number: archerNumber, name: '' })
        props.leagueOnChange({ target: { name: 'roster', value: roster } })
    }
    const removeArcher = (e, team, archer) => {
        let roster = props.league.roster

        roster[team].member.splice(archer, 1)
        roster[team].member.forEach((_element, index) => {
            roster[team].member[index].number = index
        });
        if (!roster[team].member.length) {
            roster.splice(team, 1)
            roster.forEach((_element, index) => {
                roster[index].number = index
            })
        }
        props.leagueOnChange({ target: { name: 'roster', value: roster } })
    }
    const resetRoster = () => {
        let roster = [{number: 0, member: [{number:0, name:''}], teamName: ''}]
        props.leagueOnChange({ target: { name: 'roster', value: roster } })
    }

    if (props.league.roster) {
        let roster = props.league.roster
        const teamOrInd = (
            <div>
                <label>Teams or Individuals?: </label>
                <input type="radio" name="team" onChange={e => {
                    props.leagueOnChange(e)
                    resetRoster()
                }} checked={props.league.team == "team"} value="team"></input>
                <label>Teams</label>
                <input type="radio" name="team" onChange={e => {
                    props.leagueOnChange(e)
                    resetRoster()
                }} checked={props.league.team == "individual"} value="individual" ></input>
                <label>individuals</label>
            </div>


        )
        const fields = roster.map(team => {
            let teamName
            let add
            let remove
            if (props.league.team == 'team') {
                teamName = <input type="text" name={team.number} onChange={changeTeamName} placeholder="Team Name" value={props.league.roster[team.number].teamName} required></input>

                add = <button name={team.number} onClick={addArcher}>+</button>
            }
            const member = team.member.map(archer => {
                if (team.number || archer.number) {
                    remove = <button onClick={e => { removeArcher(e, team.number, archer.number) }}>-</button>
                }
                return <input type="text" onChange={e => { changeRoster(e, team.number, archer.number) }} placeholder="Name" value={props.league.roster[team.number].member[archer.number].name} required></input >
            })
            return (
                <div>
                    {teamName}
                    {member}
                    {add}
                    {remove}
                </div>
            )
        })
        return (
            <div className="roster">
                {teamOrInd}
                {fields}
                <button onClick={addRoster}>add {props.league.teams}</button>
            </div >

        )

    }else{
        return <div></div>
    }

}

export default Roster