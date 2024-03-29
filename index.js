/* eslint-disable */

let gameRunning = true;
let winner = '';
let board = Array(3).fill(null);

for (let i = 0; i < board.length; i++) 
        board[i] = Array(3).fill(null);

let aiPlayer, other_player;

const Player = (number, piece, name, type, additionalType = undefined)  => {
    const getNumber =  () =>  number;
    const getPiece = () => piece;
    const getName = () => name;
    const getType = () => type;
    const getAdditionalType = () => additionalType;
    return {getNumber, getPiece, getName, getType, getAdditionalType};
}
const gameBoard = (() => {
    let emptySpaces = [];
    

    for (i = 0; i < 9; i++)
        emptySpaces.push(i);
    
    const getBoard = () => board;

    const getEmptySpaces = () => emptySpaces;

    const numEmptySpaces = () => emptySpaces.length;

    const changeEmptySpaces = (numberRemoved) => {
        for (let i = 0; i < emptySpaces.length; i++)
            if(emptySpaces[i] === numberRemoved) 
                emptySpaces.splice(i, 1);
    }

    const addPiece = (number, player) => {
            number = Number(number);
            changeEmptySpaces(number);
            let column = (number % 3);
            let row = parseInt(number / 3);
            // console.log({row, column})
            board[row][column] = player.getPiece();
    }
    
    const clearBoard = () => {
        board = Array(3).fill(null);
        emptySpaces = [];
        for (let i = 0; i < board.length; i++) 
            board[i] = Array(3).fill(null);
        for (i = 0; i < 9; i++)
            emptySpaces.push(i);
        document.querySelectorAll('.piece').forEach(piece => {
            piece.remove();
        })
        outcome.style.display = 'none';
    }
    
    const checkForEnd = (bord, ret="yes") => {
        let i, j;
        for (i = 0; i < bord.length; i++) {
            let iCheck = 0, iMarker;
            let jCheck = 0, jMarker;
            let diagonalCheck = 0, diagMarker;
            let diagonalCheck2 = 0, diagMarker2;
            for (j = 0; j < bord.length - 1; j++) {
                if (board[i][j] === bord[i][j+1]&& bord[i][j] !== null) {
                    iCheck++;
                    iMarker = bord[i][j];
                }
                if (bord[j][i] === bord[j+1][i] && bord[j][i] !== null) {
                    jCheck++;
                    jMarker = bord[j][i];
                }

                if (bord[j][j] === bord[j+1][j+1] && bord[j][j] !== null) {
                    diagonalCheck++;
                    diagMarker = bord[j][j];
                }
                
                if (bord[j][bord.length - j- 1]  === bord[j+1][bord.length - j - 2] && bord[j][bord.length - j - 1] !== null)
                    diagonalCheck2++;
                    diagMarker2 = bord[j][bord.length - j - 1];
            }

            if (iCheck === 2)  {if (ret==="yes") {displayController.end('won', iMarker); };  return iMarker; }
            else if (jCheck === 2) { if (ret==="yes") {displayController.end('won', jMarker);};  return jMarker; }
            else if (diagonalCheck === 2) {if (ret==="yes") {displayController.end('won', diagMarker); } return diagMarker;}
            else if (diagonalCheck2 === 2) {if (ret==="yes") {displayController.end('won', diagMarker2);} return diagMarker2};

        }

        let count = 0;
        for (i = 0; i < board.length; i++)
            for (j = 0; j < board.length; j++)
                if (board[i][j]) 
                    count++;
        setTimeout(() => {
            if (count === 9  && ret === "yes") 
                return displayController.end('draw');
        }, 0);

    }
    return {getBoard, getEmptySpaces, addPiece, checkForEnd, clearBoard, numEmptySpaces};
})();

const displayController = (() => {
    const switchDisplay = () => {
        if (document.querySelector('.startScreen').style.display === 'none') {
            document.querySelector('.startScreen').style.display = 'flex';
            document.querySelector('.cont').style.display = 'none';
            document.querySelector('.gameScreen').style.display = 'none';
            document.querySelector('.tip').style.display = 'block';
            start.style.display = 'block';
        }
        else {
            document.querySelector('.startScreen').style.display = 'none';
            document.querySelector('.cont').style.display = 'flex';
            document.querySelector('.gameScreen').style.display = 'block';
            document.querySelector('.tip').style.display = 'none';
            start.style.display = 'none';
        }
    }
    let activePlayer;
    const switchPlayerTurn = (playerOne, playerTwo) => {
        if (!activePlayer) activePlayer = playerOne;
        else activePlayer = activePlayer === playerOne ? playerTwo : playerOne;
    }

    const getActivePlayer = () => activePlayer;


    const addToScreen = (number, player) => {
        const element = document.createElement('div');
        element.classList += player.getPiece() === 'X' ? 'X piece' : 'O piece';
        element.textContent = player.getPiece() === 'X' ? 'X' : 'O';
        pieces[number].append(element);
    }
    const cancelClick = () => {
        pieces.forEach(piece => {
            piece.removeEventListener('click', play);
        })
    }
    const end = (state, sign = '') => {
        gameRunning = false;
        winner = sign;
        // console.log({state, sign});
        outcome.style.display = 'block';
        restart.style.display = 'block';
        if (state === 'won') outcome.textContent = sign === playerOne.getPiece() ? `${playerOne.getName()} has won! Congratulations!` : `${playerTwo.getName()} has won! Congratulations!`;
        else outcome.textContent = 'This is a draw.'
        cancelClick();
        
    }

    const playRound = (number) => {
            gameBoard.addPiece(number, getActivePlayer());
            gameBoard.checkForEnd(gameBoard.getBoard());
            addToScreen(number, activePlayer);
            setTimeout( () => {
                switchPlayerTurn(playerOne, playerTwo);
                playGame();
            }, 0);
    }

    const randomChoice = () => {
        number = gameBoard.getEmptySpaces()[Math.floor((Math.random() * gameBoard.getEmptySpaces().length))];
        playRound(number);
    }

    const weakAI = () => {
        cancelClick();
        setTimeout(function() {
            randomChoice();
            }, 1000);
    }  

    const bestMove = () => {
        if (!aiPlayer) {
            aiPlayer = getActivePlayer().getPiece();
            other_player = aiPlayer === 'X' ? 'O' : 'X';
        }
        let bestScore = -Infinity;
        let move;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (board[i][j] === null) {
                    board[i][j] = aiPlayer;

                    let score;
                    score = minimax(board, 0, false);
                    board[i][j] = null;
                    if (score > bestScore) {
                        bestScore = score;
                        move = 3 * i + j;
                    }
                }
            }
            }
        return move;
        }
    
    const minimax = (board, depth, isMaximizing) => {
        let counter = 0;
        for (let i = 0; i < 3; i++)
            for (let j = 0; j < 3; j++)
                if (board[i][j])
                    counter++;

        if (gameBoard.checkForEnd(board, "no") === other_player) {
            return -1;
        }
         else if (gameBoard.checkForEnd(board, "no") === aiPlayer) {
            return 1;
        }
        else if (counter === 9) {
            return 0;
        }

            if (isMaximizing) {
                let bestScore = -10;
                for (let i = 0; i < 3; i++) {
                    for (let j = 0; j < 3; j++) {
                        if (board[i][j] === null) {
                            board[i][j] = aiPlayer;
                            let score = minimax(board, depth + 1, false);
                                board[i][j] = null;
                                if (score > bestScore) {
                                    bestScore = score;
                                }
                            
                        }
                    }
                }
                    return bestScore;
            }
            else {
                let bestScore = 10;
                for (let i = 0; i < 3; i++) {
                    for (let j = 0; j < 3; j++) {
                        if (board[i][j] === null) {
                            board[i][j] = other_player;
                            let score = minimax(board, depth + 1, true);
                                board[i][j] = null;
                                if (score < bestScore) {
                                    bestScore = score;
                                }
                            
                        }
                    }
                }
                return bestScore;
            }
    }
    const smartAI = () => {
        cancelClick();
        setTimeout(function() {
            number = bestMove();
            playRound(number);
        }, 500);
    
    }
    const playGame = () => {
        if (gameRunning)  
            if (getActivePlayer().getType() === '"Player"') {
                pieces.forEach(piece => {
                        if (piece.innerHTML === '')
                            piece.addEventListener('click', play, {once : true});
                });
            }
            else {
                if (getActivePlayer().getAdditionalType() === '"SMART"') {
                    smartAI();
                }
                else
                    weakAI(); 
            }
    }
    return {playRound, end, switchDisplay, getActivePlayer, playGame, switchPlayerTurn};
})();

let playerOne, playerTwo;

function play(piece) {
    displayController.playRound(piece.target.dataset.number);
}

const pieces = document.querySelectorAll('.lilSquare');
const start = document.querySelector('#submit');
const restart = document.querySelector('#restart');
const bttns = [start, restart];
const outcome = document.querySelector('.outcome');
const type1 = document.querySelector('#type1');
const type2= document.querySelector('#type2');
const type3 = document.querySelector('#type3');
const type4 = document.querySelector('#type4');


bttns.forEach(bttn => {
    bttn.addEventListener('click', function() {
    const type1 = getComputedStyle(document.querySelector('#type1'),'::before').getPropertyValue('content');
    const type2 = getComputedStyle(document.querySelector('#type2'),'::before').getPropertyValue('content');
    let type3, type4;
    if ( getComputedStyle(document.querySelector('#type3'),'::before').getPropertyValue('content'))
        type3 =  getComputedStyle(document.querySelector('#type3'),'::before').getPropertyValue('content');
    if ( getComputedStyle(document.querySelector('#type4'),'::before').getPropertyValue('content'))
        type4 =  getComputedStyle(document.querySelector('#type4'),'::before').getPropertyValue('content');
    const name1 = document.querySelector('#name1').value !== '' ? document.querySelector('#name1').value : 'Player One';
    const name2 = document.querySelector('#name2').value !== '' ? document.querySelector('#name2').value : 'Player Two';

    if (type3)
        playerOne = Player(1, 'X', name1, type1, type3);
    else 
        playerOne = Player(1, 'X', name1, type1);
    if (type4)
        playerTwo = Player(2, 'O', name2, type2, type4);
    else
        playerTwo = Player(2, 'O', name2, type2);



    displayController.switchDisplay();

    displayController.switchPlayerTurn(playerOne, playerTwo);

    displayController.playGame();
    })
})

start.addEventListener('click', () => {
    restart.style.display = 'none';
})

restart.addEventListener('click', function() {
    gameRunning = true;
    gameBoard.clearBoard();
})

type1.addEventListener('click', function() {
    if (getComputedStyle(type1,'::before').getPropertyValue('content') === '"AI"') {
        type3.style.display = 'flex';
    }
    else {
        type3.style.display = 'none';
    }

})



type2.addEventListener('click', function() {
    if (getComputedStyle(type2,'::before').getPropertyValue('content') === '"AI"') {
        type4.style.display = 'flex';
    }
    else 
        type4.style.display = 'none';
        
})

type3.addEventListener('click', function() {
    if (getComputedStyle(type4, '::before').getPropertyValue('content') === '"SMART"') {
        type3.checked = false;
    }
})

type4.addEventListener('click', function() {
    if (getComputedStyle(type3, '::before').getPropertyValue('content') === '"SMART"') {
        type4.checked = false;
    }
})
