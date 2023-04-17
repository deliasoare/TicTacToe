const Player = (number, piece)  => {
    const getNumber =  () =>  number;
    const getPiece = () => piece;
    return {getNumber, getPiece};
}

const playerOne = Player(1, 'X');
const playerTwo = Player(2, 'O');

const gameBoard = (() => {
    const board = Array(3).fill(null);

    for (let i = 0; i < board.length; i++)
        board[i] = Array(3).fill(null);
    
    const getBoard = () => board;

    const addPiece = (number, player) => {
            let column = (number % 3);
            let row = parseInt(number / 3);
            // console.log({row, column})
            board[row][column] = player.getPiece();
    }
    
    const checkForEnd = () => {
        let i, j;
        for (i = 0; i < board.length; i++) {
            let iCheck = 0, iMarker;
            let jCheck = 0, jMarker;
            for (j = 0; j < board.length - 1; j++) {
                if (board[i][j] === board[i][j+1] && board[i][j] !== null) {
                    iCheck++;
                    iMarker = board[i][j];
                }
    
                if (board[j][i] === board[j+1][i] && board[j][i] !== null) {
                    jCheck++;
                    jMarker = board[j][i];
                }

            }
            if (iCheck === 2)  return displayController.end('won', iMarker);
            else if (jCheck === 2) return displayController.end('won', jMarker);
        }

        let count = 0;
        for (i = 0; i < board.length; i++)
            for (j = 0; j < board.length; j++)
                if (board[i][j]) {
                    count++;
                    console.log(count);
                }
        setTimeout(() => {
            if (count === 9) 
                return displayController.end('draw');
        }, 0);

    }
    return {getBoard, addPiece, checkForEnd};
})();

const displayController = (() => {
    let activePlayer = playerOne;

    const switchPlayerTurn = () => {
        activePlayer = activePlayer === playerOne ? playerTwo : playerOne;
    }

    const getActivePlayer = () => activePlayer;

    const addToScreen = (HTMLpiece, player) => {
        const element = document.createElement('div');
        element.classList = player.getPiece() === 'X' ? 'X piece' : 'O piece';
        element.textContent = player.getPiece() === 'X' ? 'X' : 'O';
        HTMLpiece.append(element);
        console.log(HTMLpiece);
    }

    const end = (state, sign = 'none') => {
        console.log({state, sign});
        pieces.forEach(piece => {
            piece.removeEventListener('click', play);
        })
    }

    const playRound = (HTMLpiece) => {
            gameBoard.addPiece(HTMLpiece.dataset.number, getActivePlayer());
            addToScreen(HTMLpiece, getActivePlayer());
            setTimeout( () => {
                gameBoard.checkForEnd();
                switchPlayerTurn();
            }, 0);
    }
    return {playRound, end};
})();

const pieces = document.querySelectorAll('.lilSquare');
function play(piece) {
    displayController.playRound(piece.target);
}
pieces.forEach(piece => {
    piece.addEventListener('click', play, {once : true});
});
