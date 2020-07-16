export function gameOnChange(e) {
    return {
        type: "GAMEONCHANGE",
        target: e.target.name,
        payload: e.target.value
    }
}