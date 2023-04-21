const Player = (number, piece, name, type)  => {
    const getNumber =  () =>  number;
    const getPiece = () => piece;
    const getName = () => name;
    const getType = () => type;
    return {getNumber, getPiece, getName, getType};
}
const gameBoard = (() => {
    const board = Array(3).fill(null);
    let emptySpaces = [];
    for (let i = 0; i < board.length; i++) 
        board[i] = Array(3).fill(null);

    for (i = 0; i < 9; i++)
        emptySpaces.push(i);
    
    const getBoard = () => board;

    const getEmptySpaces = () => emptySpaces;

    const changeEmptySpaces = (numberRemoved) => {
        console.log(emptySpaces);
        for (i = 0; i < emptySpaces.length; i++)
            if(emptySpaces[i] === numberRemoved) 
                emptySpaces.splice(i, 1);
    }

    const addPiece = (number, player) => {
            number = Number(number);
            changeEmptySpaces(number);
            console.log({emptySpaces, number});
            let column = (number % 3);
            let row = parseInt(number / 3);
            // console.log({row, column})
            board[row][column] = {piece: player.getPiece(), number : number};

    }
    
    const checkForEnd = () => {
        let i, j;
        for (i = 0; i < board.length; i++) {
            let iCheck = 0, iMarker;
            let jCheck = 0, jMarker;
            let diagonalCheck = 0, diagMarker;
            let diagonalCheck2 = 0, diagMarker2;
            for (j = 0; j < board.length - 1; j++) {
                if (board[i][j] === board[i][j+1] && board[i][j] !== null) {
                    iCheck++;
                    iMarker = board[i][j];
                }
    
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

            if (iCheck === 2)  return displayController.end('won', iMarker);
            else if (jCheck === 2) return displayController.end('won', jMarker);
            else if (diagonalCheck === 2) {return displayController.end('won', diagMarker);}
            else if (diagonalCheck2 === 2) {return displayController.end('won', diagMarker2)};

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
    return {getBoard, getEmptySpaces, addPiece, checkForEnd};
})();

const displayController = (() => {
    const switchDisplay = () => {
        if (document.querySelector('.startScreen').style.display === 'none') {
            document.querySelector('.startScreen').style.display = 'flex';
            document.querySelector('.cont').style.display = 'none';
            start.style.display = 'block';
        }
        else {
            document.querySelector('.startScreen').style.display = 'none';
            document.querySelector('.cont').style.display = 'flex';
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
        element.classList = player.getPiece() === 'X' ? 'X piece' : 'O piece';
        element.textContent = player.getPiece() === 'X' ? 'X' : 'O';
        pieces[number].append(element);
    }
    const cancelClick = () => {
        pieces.forEach(piece => {
            piece.removeEventListener('click', play);
        })
    }
    const end = (state, sign = 'none') => {
        // console.log({state, sign});
        cancelClick();
        const outcome = document.querySelector('.outcome');
        if (state === 'won') outcome.textContent = sign === playerOne.getPiece() ? `${playerOne.getName()} has won! Congratulations!` : `${playerTwo.getName()} has won! Congratulations!`;
        else outcome.textContent = 'This is a draw.'
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

    const playGame = () => {
        if (getActivePlayer().getType() === '"Player"') {
            pieces.forEach(piece => {
                    piece.addEventListener('click', play, {once : true});
            });
        }
        else {
            cancelClick();
            number = gameBoard.getEmptySpaces()[Math.floor(Math.random() * gameBoard.getEmptySpaces().length) + 1];
            
            playRound(number);
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

start.addEventListener('click', function() {
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

