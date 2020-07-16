export function updateScoreboard(scoreArr) {
    return {
        type: "UPDATELSCOREBOARD",
        payload: scoreArr
    }
}