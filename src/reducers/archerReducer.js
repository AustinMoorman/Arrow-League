const archerReducer = (state = {
game: {
    roster: [],
    scoring: [],
    currentlyScoring: {archerID: null, scores: []}
}
}, action) => {
    switch (action.type) {
        case "GAMEONCHANGE":
            state = {
                ...state,
                game: {
                    ...state.game,
                    [action.target]: action.payload
                }
            }
            break;
    }
    return state
}

export default archerReducer