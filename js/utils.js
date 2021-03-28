/////////////////////////////// Util Functions ///////////////////////////////
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
}

/////////////////////////////// timer function ///////////////////////////////

function countTime(time) {
    return time > 9 ? time : '0' + time;
}

function startTimer() {
    gTimerInterval = setInterval(function () {
        elSecTimer.innerHTML = countTime(++gGame.secsPassed % 60);
        elMinTimer.innerHTML = countTime(parseInt(gGame.secsPassed / 60, 10));
    }, 1000);
}

function stopTimer() {
    clearInterval(gTimerInterval);
}

/////////////////////////////// - ///////////////////////////////
/////////////////////////////// - ///////////////////////////////