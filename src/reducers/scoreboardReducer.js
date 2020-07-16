const scoreboardReducer = (state = {
    }, action) => {
        switch (action.type) {
            case "UPDATELSCOREBOARD":
                state = action.payload
                break;
        }
        return state
    }
    
    export default scoreboardReducer