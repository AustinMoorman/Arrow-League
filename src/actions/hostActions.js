export function leagueOnChange(e) {
    return {
        type: "LEAGUEONCHANGE",
        target: e.target.name,
        payload: e.target.value
    }
}
export function leaguesOnChange(e,index) {
    return {
        type: "LEAGUESONCHANGE",
        target: e.target.name,
        payload: e.target.value,
        index
    }
}
export function defaultCreateLeague(gamemodeID) {
    return {
        type: "DEFAULTCREATELEAGUE",
        payload: gamemodeID
    }
}
export function setLeagues(leagues) {
    return {
        type: "SETLEAGUES",
        payload: leagues
    }
}