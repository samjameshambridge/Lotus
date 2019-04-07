export const state = {
    notice: '',
    playState: "paused",
    timeCtrlActive: false, // is any part of the timing system active
    timerIsRunning: false
};

export default function updateState(updState) {
    Object.keys(updState).forEach(key => state[key] = updState[key]);
}