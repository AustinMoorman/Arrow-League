const headReducer = (state = {
    user: {},
    page: 'Home',
    history: [],
    headError: ''
}, action) => {
    switch (action.type) {
        case "LOGOUT":
            state = {
                page: 'Home',
                user: {},
                history: []
            }
            break;
        case "LOGIN":
            state = {
                ...state,
                logOut: true,
                user: action.payload,
            }
            break;
        case "SWITCH PAGE":
            let history = state.history
            history.push(state.page)
                state = {
                    ...state,
                    history,
                    headError: '',
                    page: action.payload
                }
                break;
        case "BACK":
            let hist = state.history
            let page = hist[hist.length - 1]
            hist.pop()
            state = {
                ...state,
                history: hist,
                headError: '',
                page
            }
            break;
            case "ONCHANGE":
                state = {
                    ...state,
                    user: {
                        ...state.user,
                        [action.target]: action.payload
                    }
                }
            break;
            case "RESET USER":
                state = {
                    ...state,
                    user: {
                        rangeName: '',
                        email: '',
                        password: '',
                        rePassword: '',
                        forgottenEmail: ''
                    }
                }
                break;
            case "HEAD ERROR":
                state = {
                    ...state,
                    headError: action.payload
                }
    }
    return state;
}

export default headReducer