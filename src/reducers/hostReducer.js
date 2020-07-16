const hostReducer = (state = {
    league: {
        gameModes:[]
    },
    leagues: []

}, action) => {
    switch (action.type) {
        case "LEAGUEONCHANGE":
            state = {
                ...state,
                league: {
                    ...state.league,
                    [action.target]: action.payload
                }
            }
        break;
        case "LEAGUESONCHANGE":
            let leagues = state.leagues
            leagues[action.index][action.target] = action.payload
            state = {
                ...state,
                leagues
            }
        break;
        case "DEFAULTCREATELEAGUE":
            state = {
                ...state,
                league: {
                    leagueName: '',
                    gameModes: state.league.gameModes,
                    message: state.league.message,
                    schedule: [action.payload],
                    duration: 1,
                    gameChanges: "false",
                    team: 'individual',
                    handicap: 'false',
                    freeScoring: 'true',
                    scorers: [{}],
                    roster:[{number: 0, member: [{number:0, name:''}], teamName: ''}]
                }
            }
            break;
            case "SETLEAGUES":
                state = {
                    ...state,
                    leagues: action.payload
                }
    }
    return state
}

export default hostReducer