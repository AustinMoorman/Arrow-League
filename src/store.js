import {createStore, combineReducers} from "redux"

import head from "./reducers/headReducer"
import host from "./reducers/hostReducer"
import archer from "./reducers/archerReducer"
import scoreboard from "./reducers/scoreboardReducer"

export default createStore(
    combineReducers({
        head,
        host,
        archer,
        scoreboard
    })
)