import updateState from './state.js';
import { state } from './state.js';

const play = document.querySelector(".play"),
    song = document.querySelector("audio"),
    video = document.querySelector("video"),
    timerBtn = document.querySelector(".timer-set img"),
    timerInput = document.querySelector(".timer-set input"),
    outline = document.querySelector(".moving-outline circle"),
    outlineLength = outline.getTotalLength();

const playCtrl = {
    pause: function () {
        play.src = "./svg/play.svg";
        play.style.left = "1vw";
        video.pause();
        song.pause();
        updateState({ playState: "paused" });
    },

    play: function () {
        play.src = "./svg/pause.svg";
        play.style.left = "0";
        video.play();
        song.play();
        updateState({ playState: "playing" })
    },

    playHelper: function () {
        if (!state.timeCtrlActive) {
            if (timerInput.value !== "00:00:00" && timerInput.value !== "--:--:--") timerBtn.click(); // defer playing functionality to the timerbtn
            else if (video.paused) { // else treat it as normal
                playCtrl.play()
                playCtrl.trackVisibility('hidden');
            }
            else playCtrl.pause();
        } else {
            if (state.playState === "paused") {
                updateState({ notice: "" });
                timerBtn.click();
            } else updateState({ notice: "PAUSE" }); // send a message to the timerBtn to pause
        }
    },

    playListeners: function () {
        const icons = document.querySelectorAll(".icon-group img");

        document.addEventListener("keyup", e => {
            if (e.code == "Space") playCtrl.playHelper();
        })

        icons.forEach(img =>
            img.addEventListener("click", () => {
                let toBePlayed;

                video.paused ? toBePlayed = false : toBePlayed = true;

                video.src = img.getAttribute("data-video");
                song.src = img.getAttribute("data-sound");

                toBePlayed ? this.play() : this.pause(); //the new video will opened in the previous videos state
            })
        );

        play.addEventListener("click", this.playHelper);

        timerBtn.addEventListener('click', this.timeCtrl);

        timerInput.addEventListener('keyup', () => {
            if (state.timeCtrlActive) timerBtn.click();
        })
    },

    resetTimerBasedUi: function () {
        timerInput.value = "00:00:00";
        playCtrl.trackVisibility('hidden');
        playCtrl.pause();
    },

    timeCtrl: function () {
        // cases where the timer should not run
        if (timerInput.value === "00:00:00") {
            playCtrl.trackVisibility('hidden');
            updateState({ timerIsRunning: false, timeCtrlActive: false });
            return;
        }
        if (timerInput.value === "00:00:01") {
            timerInput.value = "00:00:00";
            return;
        }
        else {
            playCtrl.trackVisibility('visible');

            if (!state.timerIsRunning) {
                if (state.timeCtrlActive && state.notice === "PAUSE") {
                    // timer paused from play button click and a fresh play input has been entered
                    playCtrl.play();
                    updateState({ notice: "" });
                } else if (state.timeCtrlActive) {
                    // timer is paused from a timerBtn click and a fresh play input has been entered
                    playCtrl.play();
                } else {
                    // neither timer nor timectrl are active
                    playCtrl.play();
                    updateState({ isTimeRunning: false, timeCtrlActive: true });
                }
            } else {
                // timerBtn clicked while running
                updateState({ notice: "PAUSE" });
                playCtrl.pause();
            }

            let clickTime = Date.now(),
                hrsStr = timerInput.value.split("").slice(0, 2).join(""),
                minsStr = timerInput.value.split("").slice(3, 5).join(""),
                secsStr = timerInput.value.split("").slice(6).join("");

            if (!secsStr) secsStr = "00";

            // remove the front 0
            if (hrsStr[0] === '0') hrsStr = hrsStr.substring(1);
            if (minsStr[0] === '0') minsStr = minsStr.substring(1);
            if (secsStr[0] === '0') secsStr = secsStr.substring(1);

            // convert input into total of seconds and calculate finish timstamp
            let totalSeconds = parseInt(secsStr) + (parseInt(hrsStr) * 3600) + (parseInt(minsStr) * 60),
                finishTime = clickTime + (totalSeconds * 1000);

            const timer = setInterval(() => {
                if (state.notice === "PAUSE") {
                    // state has been updated to pause the interval
                    playCtrl.pause();
                    clearInterval(timer);
                    updateState({ timerIsRunning: false, timeCtrlActive: true });
                } else {
                    updateState({ timerIsRunning: true, timeCtrlActive: true });

                    if (timerInput.value !== "00:00:01") {
                        let totalSecondsRemaining = Math.round((finishTime - Date.now()) / 1000),
                            hrsRemaining = Math.floor(totalSecondsRemaining / 3600),
                            minsRemaining = Math.floor((totalSecondsRemaining - (hrsRemaining * 3600)) / 60),
                            secsRemaining = totalSecondsRemaining - (hrsRemaining * 3600) - (minsRemaining * 60);

                        playCtrl.trackHandler(totalSeconds, totalSecondsRemaining);

                        if (hrsRemaining < 10) hrsRemaining = `0${hrsRemaining}`;
                        if (minsRemaining < 10) minsRemaining = `0${minsRemaining}`;
                        if (secsRemaining < 10) secsRemaining = `0${secsRemaining}`;

                        timerInput.value = `${hrsRemaining}:${minsRemaining}:${secsRemaining}`;

                        if (timerInput.value === "") {
                            clearInterval(timer);
                            playCtrl.resetTimerBasedUi();
                            updateState({ timerIsRunning: false, timeCtrlActive: false });
                        }
                    } else {
                        // at one second the code clears the timer and takes manual control
                        playCtrl.trackHandler(totalSeconds, 0);
                        clearInterval(timer);
                        playCtrl.resetTimerBasedUi();
                        updateState({ timerIsRunning: false, timeCtrlActive: false });
                    }
                }
            }, 1000);
        }
    },

    trackHandler: function (duration, secondsRemaining) {
        outline.style.strokeDashoffset = outlineLength;
        outline.style.strokeDasharray = outlineLength;

        outline.style.strokeDashoffset = (duration - secondsRemaining) * (outlineLength / duration);
    },

    trackVisibility: function (value) {
        document.querySelector(".track-outline").style.visibility = `${value}`;
        outline.style.visibility = `${value}`;
    }
}

export default function initPlayer() {
    playCtrl.playListeners();
}
