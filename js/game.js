'use strict'
const MINE = '🧨';
const FLAG = '🏴‍☠️';
const EMPTY = '';

const elSecTimer = document.querySelector('.seconds')
const elMinTimer = document.querySelector('.minutes')

var gFirstClickedI;
var gFirstClickedJ;
var gTimerInterval;


var gBoard;
var gLevels;
var gCurrLevelIdx;
var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0
};


function initGame(level) {
    gGame.secsPassed = 0;
    gGame.isOn = false
    gLevels = [{
        SIZE: 4,
        MINES: 2
    }, {
        SIZE: 8,
        MINES: 12
    }, {
        SIZE: 12,
        MINES: 30
    }]
    gCurrLevelIdx = level
    gGame.shownCount = gLevels[gCurrLevelIdx].size** - gLevels[gCurrLevelIdx].mines
    gGame.markedCount = 0;
    gBoard = buildBoard();
    renderBoard();
    elMinTimer.innerHTML = '00'
    elSecTimer.innerHTML = '00'
    stopTimer(gTimerInterval)

}


function buildBoard() {
    var board = [];
    var size = gLevels[gCurrLevelIdx].SIZE
    for (var i = 0; i < size; i++) {
        board.push([]);
        for (var j = 0; j < size; j++) {
            board[i][j] = {
                minesAroundCount: 0,
                isShown: false,
                isMine: false,
                isMarked: false
            };
        }
    }

    return board;
}

function renderBoard() {
    var strHtml = '';
    for (var i = 0; i < gBoard.length; i++) {
        strHtml += '<tr>';
        for (var j = 0; j < gBoard.length; j++) {
            gBoard[i][j];
            var className = `cell cell${i}-${j}`
            // console.log('className', className)
            // var mine = (board[i][j].isMine) ? 'mine' : ''
            strHtml += `<td class= "${className}" onmousedown="cellClicked(this,${i},${j}, event)"></td>`;
        }
        strHtml += '</tr>';
    }
    var elBoard = document.querySelector('.board');
    elBoard.innerHTML = strHtml;
}

function setMinesNegsCount(cellI, cellJ) {
    // var minesAroundCount = 0;
    // board[cellI][cellJ].minesAroundCount
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= gBoard.length) continue;
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (i === cellI && j === cellJ) continue;
            if (j < 0 || j >= gBoard[i].length) continue;

            if (gBoard[i][j].isMine) {
                gBoard[cellI][cellJ].minesAroundCount += 1;
            }
        }
    }
    // console.log('minesAroundCount', minesAroundCount)
    // return minesAroundCount;
}

// function setMinesNegsCount(board, cellI, cellJ) {
// board[cellI][cellJ].minesAroundCount = minesAroundCount;
//     for (var i = cellI - 1; i <= cellI + 1; i++) {
//         if (i < 0 || i >= board.length) continue;
//         for (var j = cellJ - 1; j <= cellJ + 1; j++) {
//             if (i === cellI && j === cellJ) continue;
//             if (j < 0 || j >= board[i].length) continue;

//             if (board[i][j].isMine) minesAroundCount++
//         }
//     }
//     // console.log('minesAroundCount', minesAroundCount)
//     return minesAroundCount;
// }

function cellClicked(elCell, i, j, ev) {
    var clickedCell = gBoard[i][j]
    if (clickedCell.isShown) return
    if (ev.button === 2 && gGame.isOn) {
        if (!clickedCell.isMarked) {
            clickedCell.isMarked = true;
            elCell.innerText = FLAG
            gGame.markedCount++
            return
        }
        clickedCell.isMarked = false
        gGame.markedCount--
        elCell.innerText = ''
    }
    if (ev.button === 0) {
        clickedCell.isShown = true;
        gGame.shownCount--
        if (!gGame.isOn) {
            gGame.isOn = true
            gFirstClickedI = i;
            gFirstClickedJ = j;
            buildBoard()
            randomMines()
            startTimer()
        }

        if (!clickedCell.isMine) {
            setMinesNegsCount(i, j)
            elCell.innerHTML = (!clickedCell.minesAroundCount) ? (elCell.style.backgroundColor = 'lightblue', elCell.innerText = '') : (elCell.innerText = clickedCell.minesAroundCount)
        }
        if (clickedCell.isMine) {
            elCell.innerText = MINE;
            // alert('GAME OVER!');
            // stopTimer()
            // gGame.isOn = false
        }

    }
}


function randomMines() {
    // var getRandomIntI = 0;
    // var getRandomIntJ = 0;
    var mines = gLevels[gCurrLevelIdx].MINES
    while (mines) {
        var getRandomIntI = getRandomInt(0, gBoard.length)
        var getRandomIntJ = getRandomInt(0, gBoard.length)
        if (getRandomIntI !== gFirstClickedI && getRandomIntJ !== gFirstClickedJ && !gBoard[getRandomIntI][getRandomIntJ].isMine) {
            mines -= 1
            gBoard[getRandomIntI][getRandomIntJ].isMine = true
        }
    }
}


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

// function checkGameOver() {

// }

expandShown()
function expandShown(board, elCell, i, j) {
   var dirctionsCount = setMinesNegsCount(elCell)

}

openNegCell();
function openNegCell() {
    dirctionsCount--;
    if (dirctionsCount < 1) return;
    console.log('open');
    openNegCell();
    console.log('stop open');
}