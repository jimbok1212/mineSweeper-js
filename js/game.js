'use strict'
var gFirstClickedI, gFirstClickedJ, gTimerInterval, 
mineLocation, gBoard, gLevels, gCurrLevelIdx, isGameOver;

var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0
};


const elSecTimer = document.querySelector('.seconds')
const elMinTimer = document.querySelector('.minutes')
const elLife = document.querySelector('.lifes')
const elSmiley = document.querySelector('.smiley')
const elHint = document.querySelector('.hint')

const MINE = '💣';
const FLAG = '🏴‍☠️';
const LIFE = '❤'
const HAPPY_SMILEY = '😁'
const SAD_SMILEY = '😥'
const NORMAL_SMILEY = '😊'
const HINT = '💡'

var boomSound= new Audio('sounds/boom.mp3')
var youLostSound= new Audio('sounds/lost.wav')
var youWonSound= new Audio('sounds/won.wav')

function initGame(level) {
    mineLocation = []
    gGame.secsPassed = 0;
    gGame.isOn = false
    gLevels = [{
        SIZE: 4,
        MINES: 2,
        LIFE: 1,
        HINT: 1
    }, {
        SIZE: 8,
        MINES: 12,
        LIFE: 2,
        HINT: 2
    }, {
        SIZE: 12,
        MINES: 30,
        LIFE: 3,
        HINT: 3
    }]
    gCurrLevelIdx = level
    gGame.shownCount = (gLevels[gCurrLevelIdx].SIZE * gLevels[gCurrLevelIdx].SIZE) - gLevels[gCurrLevelIdx].MINES
    renderObject('LIFE')
    renderObject('HINT')
    gGame.markedCount = 0;
    gBoard = buildBoard();
    renderBoard();
    elMinTimer.innerHTML = '00'
    elSecTimer.innerHTML = '00'
    stopTimer(gTimerInterval)
    renderSmiley()
    isGameOver = false
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
            var className = `cell cell-${i}-${j}`
            strHtml += `<td class= "${className}" onmousedown="cellClicked(this,${i},${j}, event)"></td>`;
        }
        strHtml += '</tr>';
    }
    var elBoard = document.querySelector('.board');
    elBoard.innerHTML = strHtml;
}

function renderObject(status) {
    var el, gameElement, levelKeyObject
    switch (status) {
        case 'HINT':
            el = elHint
            gameElement = HINT
            levelKeyObject = gLevels[gCurrLevelIdx].HINT
            break;
            // case 'SAFE-CLICK':
                // break;
                case 'LIFE':
                    el = elLife
                    gameElement = LIFE
                    levelKeyObject = gLevels[gCurrLevelIdx].LIFE
                }
    var amount = ''
    for (var i = 0; i < levelKeyObject; i++) {
        amount += gameElement
    }
    el.innerHTML = amount
}

function renderSmiley(status) {
    switch (status) {
        case 'win':
            elSmiley.innerHTML = HAPPY_SMILEY
            break;
        case 'lose':
            elSmiley.innerHTML = SAD_SMILEY
            break;
            default:
                elSmiley.innerHTML = NORMAL_SMILEY
            }
}

function cellClicked(elCell, i, j, ev) {
    var clickedCell = gBoard[i][j]
    if (clickedCell.isShown || isGameOver) return
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
    if (ev.button === 0 && !clickedCell.isMarked) {
        elCell.classList.add('revealed')
        clickedCell.isShown = true;
        gGame.shownCount--
        if (!gGame.shownCount) {
            gameOverBaby('win')
            return
        }
        if (!gGame.isOn) {
            gGame.isOn = true
            gFirstClickedI = i;
            gFirstClickedJ = j;
            buildBoard()
            randomMines()
            startTimer()
        }
        if (clickedCell.isMarked) return
        if (!clickedCell.isMine) {
            setMinesNegsCount(i, j, elCell)
            if (!clickedCell.minesAroundCount) expandShown(i, j, elCell)
        }
        if (clickedCell.isMine) {
            elCell.innerHTML = MINE 
            gLevels[gCurrLevelIdx].LIFE--
            boomSound.play()
            renderObject('LIFE')
            gGame.shownCount--
            if (gLevels[gCurrLevelIdx].LIFE < 0) {
                gGame.isOn = false
                gameOverBaby('lose')
            }
        }
    }
}

function randomMines() {
    var mines = gLevels[gCurrLevelIdx].MINES
    while (mines) {
        var getRandomIntI = getRandomInt(0, gBoard.length)
        var getRandomIntJ = getRandomInt(0, gBoard.length)
        if (getRandomIntI !== gFirstClickedI &&
            getRandomIntJ !== gFirstClickedJ &&
            !gBoard[getRandomIntI][getRandomIntJ].isMine) {
            mines -= 1
            gBoard[getRandomIntI][getRandomIntJ].isMine = true
            mineLocation.push({
                i: getRandomIntI,
                j: getRandomIntJ
            })
        }
    }
}

function setMinesNegsCount(cellI, cellJ, elCell) {
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
    if (gBoard[cellI][cellJ].minesAroundCount) elCell.innerHTML = gBoard[cellI][cellJ].minesAroundCount
}

function expandShown(cellI, cellJ) {
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= gBoard.length) continue;
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (i === cellI && j === cellJ) continue;
            if (j < 0 || j >= gBoard[i].length) continue;
            var currCell = gBoard[i][j]
            var elCurrCell = document.querySelector(`.cell-${i}-${j}`)
            if (!currCell.isMarked && !currCell.isMine && !currCell.isShown) {
                gGame.shownCount--
                currCell.isShown = true
                elCurrCell.classList.add('revealed')
                setMinesNegsCount(i, j, elCurrCell)
                if (!currCell.minesAroundCount) expandShown(i, j)
            }
        }
    }
}

function gameOverBaby(status) {
    stopTimer()
    isGameOver = true
    renderSmiley(status)
    for (var v = 0; v < mineLocation.length; v++) {
        var elCurrCell = document.querySelector(`.cell-${mineLocation[v].i}-${mineLocation[v].j}`)
        elCurrCell.innerHTML = MINE
        elCurrCell.classList.add('revealed')
    }
    if (status === 'lose') {
        youLostSound.play()
        return
    }
    youWonSound.play()
}

function resetGame() {
    initGame(gCurrLevelIdx)
}



// function renderCell(i,j,elCell) {
// currCell = gBoard[i][j]
// currCell.isShown = true
// if (currCell.minesAroundCount) elCell.innerHTML = currCell.minesAroundCount
// }