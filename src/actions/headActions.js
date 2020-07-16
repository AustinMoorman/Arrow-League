
export function logOut() {
    return {
        type: "LOGOUT"
    }
}
export function logIn(user) {
    return {
        type: "LOGIN",
        payload: user
    }
}
export function switchPage(page) {
    return {
        type: "SWITCH PAGE",
        payload: page
    }
}
export function back() {
    return {
        type: "BACK"
    }
}
export function onChange(e) {
    return {
        type: "ONCHANGE",
        target: e.target.name,
        payload: e.target.value
    }
}
export function resetUser() {
    return {
        type: "RESET USER"
    }
}
export function setHeadError(message) {
    return {
        type: "HEAD ERROR",
        payload: message
    }
}
