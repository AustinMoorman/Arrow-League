import React, { useEffect } from 'react'

const Schedule = props => {
    useEffect(() => {
        if (props.league.gameModes[0]) {
            const schedule = props.league.schedule
            const duration = Number(props.league.duration)
            let defaultGameMode = props.league.gameModes[0].ID
            if(props.league.gameChanges == "false" || props.league.gameChanges == 0){
                defaultGameMode = schedule[0]
            }
            let newSchedule = []
            for (let i = 0; i < duration; i++) {
                newSchedule.push(schedule[i] || defaultGameMode)
                props.leagueOnChange({ target: { name: 'schedule', value: newSchedule } })
            }
        }


    }, [props.league.duration])
    const changeSchedule = (e) => {
        let sched = props.league.schedule
        if (props.league.gameChanges == "false" || props.league.gameChanges == 0) {
            for (let i = 0; i < sched.length; i++){
                sched[i] = Number(e.target.value)
            }
        } else {
            sched[e.target.name] = Number(e.target.value)
        }
        props.leagueOnChange({ target: { name: 'schedule', value: sched } })


    }
    if (props.league.schedule && props.league.schedule.length) {
        let gameOptions = []
        const duration = Number(props.league.duration)
        let gameModes = props.league.gameModes
        gameModes = gameModes.map(game => {
            return <option value={game.ID}>{game.name}</option>
        })
        if (props.league.gameChanges == "true") {
            for (let i = 0; i < duration; i++) {
                gameOptions.push(
                    <div>
                        <label>Event {i + 1}: </label>
                        <select name={i} onChange={changeSchedule} value={props.league.schedule[i]}>
                            {gameModes}
                        </select>
                    </div>
                )
            }
        } else {
            gameOptions.push(
                <div>
                    <label>Game Mode: </label>
                    <select name={0} onChange={changeSchedule} value={props.league.schedule[0]}>
                        {gameModes}
                    </select>
                </div>
            )
        }
        return (
            <div className="schedule">
                <label>Is the game mode the same throughout the entire league?: </label>
                <input type="radio" name="gameChanges" onChange={props.leagueOnChange} checked={props.league.gameChanges == "true" || props.league.gameChanges == 1} value={true}></input>
                <label>No</label>
                <input type="radio" name="gameChanges" onChange={props.leagueOnChange} checked={props.league.gameChanges == "false" || props.league.gameChanges == 0} value={false}></input>
                <label>Yes</label>
                {gameOptions}
            </div>
        )

    } else {
        return <div></div>
    }
}

export default Schedule