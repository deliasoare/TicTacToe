let gameRunning = true;
let winner = '';
const Player = (number, piece, name, type)  => {
    const getNumber =  () =>  number;
    const getPiece = () => piece;
    const getName = () => name;
    const getType = () => type;
    return {getNumber, getPiece, getName, getType};
}
const gameBoard = (() => {
    let board = Array(3).fill(null);
    let emptySpaces = [];
    for (let i = 0; i < board.length; i++) 
        board[i] = Array(3).fill(null);

    for (i = 0; i < 9; i++)
        emptySpaces.push(i);
    
    const getBoard = () => board;

    const getEmptySpaces = () => emptySpaces;

    const numEmptySpaces = () => emptySpaces.length;

    const changeEmptySpaces = (numberRemoved) => {
        for (i = 0; i < emptySpaces.length; i++)
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
    
    const checkForEnd = () => {
        let i, j;
        for (i = 0; i < board.length; i++) {
            let iCheck = 0, iMarker;
            let jCheck = 0, jMarker;
            let diagonalCheck = 0, diagMarker;
            let diagonalCheck2 = 0, diagMarker2;
            for (j = 0; j < board.length - 1; j++) {
                if (board[i][j] === board[i][j+1]&& board[i][j] !== null) {
                    iCheck++;
                    iMarker = board[i][j];
                }
                console.log({ i, j, board: board[j][i] });
                if (board[j][i] === board[j+1][i] && board[j][i] !== null) {
                    jCheck++;
                    jMarker = board[j][i];
                }

                if (board[j][j] === board[j+1][j+1] && board[j][j] !== null) {
                    diagonalCheck++;
                    diagMarker = board[j][j];
                }
                
                if (board[j][board.length - j- 1]  === board[j+1][board.length - j - 2] && board[j][board.length - j - 1] !== null)
                    diagonalCheck2++;
                    diagMarker2 = board[j][board.length - j - 1];
            }

            if (iCheck === 2)  {displayController.end('won', iMarker); return iMarker}
            else if (jCheck === 2) {displayController.end('won', jMarker); return jMarker; }
            else if (diagonalCheck === 2) {displayController.end('won', diagMarker); return diagMarker;}
            else if (diagonalCheck2 === 2) {displayController.end('won', diagMarker2); return diagMarker2};

        }

        let count = 0;
        for (i = 0; i < board.length; i++)
            for (j = 0; j < board.length; j++)
                if (board[i][j]) 
                    count++;
        setTimeout(() => {
            if (count === 9) 
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
            start.style.display = 'block';
        }
        else {
            document.querySelector('.startScreen').style.display = 'none';
            document.querySelector('.cont').style.display = 'flex';
            document.querySelector('.gameScreen').style.display = 'block';
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
            gameBoard.addPiece(number, activePlayer);
            addToScreen(number, activePlayer);
            setTimeout( () => {
                gameBoard.checkForEnd();
                switchPlayerTurn(playerOne, playerTwo);
                playGame();
            }, 0);
    }

    const randomChoice = () => {
        number = gameBoard.getEmptySpaces()[Math.floor((Math.random() * gameBoard.getEmptySpaces().length))];
        playRound(number);
    }

    const minimax = (crrBdState, mark) => {
        let emptySpots = gameBoard.getEmptySpaces();
        const other_player = mark === 'X' ? 'O' : 'X';

        let result = gameBoard.checkForEnd();
        if (emptySpots.length === 0)
            return 0;
        if (result)
            if (result === mark)
                return 1;
            else
                return -1;
        
        const allTestPlayInfos = [];

        for (let i = 0; i < emptySpots.length; i++) {
            const currentTestPlay = {};
            currentTestPlay.index = crrBdState[emptySpots[i]];
            crrBdState[emptySpots[i]] = mark;
            let res;
            let otherMark = mark === 'X' ? 'O' : 'X';
            if (mark === getActivePlayer().getPiece()) {
                 res = minimax(crrBdState, otherMark);
                 currentTestPlay.score = res;
            }
            else if (mark === other_player) {
                res = minimax(crrBdState, mark);
                currentTestPlay.score = res;
            }

            crrBdState[emptySpots[i]] = currentTestPlay.index;

            allTestPlayInfos.push(currentTestPlay);

          }


            let bestTestPlay =  null;

            let bestScore;

            if (mark === getActivePlayer().getPiece()) {
                bestScore = -1000;
                for (let i = 0; i < allTestPlayInfos.length; i++) {
                    if (allTestPlayInfos[i].score > bestScore) {
                        bestScore = allTestPlayInfos[i].score;
                        bestTestPlay = i;
                    }
                }
            }
            else if (mark === other_player) {
                bestScore = 1000;
                for (let i = 0; i < allTestPlayInfos.length; i++) {
                    if (allTestPlayInfos[i].score < bestScore) {
                        bestScore = allTestPlayInfos[i].score;
                        bestTestPlay = i;
                    }
                }
            }

            return bestTestPlay;

    }

    const smartAI = () => {
        cancelClick();
        if (gameBoard.getEmptySpaces() === 9)
            randomChoice();
        else {
            cancelClick();
            number = minimax(gameBoard.getBoard(), getActivePlayer().getPiece());
            playRound(number);
        }
    }
    const weakAI = () => {
        cancelClick();
        setTimeout(function() {
            randomChoice();
            }, 1000);
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
                smartAI();   
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


bttns.forEach(bttn => {
    bttn.addEventListener('click', function() {
    const type1 = getComputedStyle(document.querySelector('#type1'),'::before').getPropertyValue('content');
    const type2 = getComputedStyle(document.querySelector('#type2'),'::before').getPropertyValue('content');

    const name1 = document.querySelector('#name1').value !== '' ? document.querySelector('#name1').value : 'Player One';
    const name2 = document.querySelector('#name2').value !== '' ? document.querySelector('#name2').value : 'Player Two';

    playerOne = Player(1, 'X', name1, type1);
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

