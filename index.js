const Player = (number, piece)  => {
    const getNumber =  () =>  number;
    const getPiece = () => piece;
    return {getNumber, getPiece};
}

const playerOne = Player(1, 'X');
const playerTwo = Player(2, 'O');

const gameBoard = (() => {
    const board = Array(9).fill(null);
    
    const getBoard = () => board;

    const addPiece = (number, player) => {
        if (board[number] === null) {
            board[number] = player.getPiece();
            return 1;
        }
    }
    
    return {getBoard, addPiece};
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

    const playRound = (HTMLpiece) => {
            if (gameBoard.addPiece(HTMLpiece.dataset.number, getActivePlayer())) {
                setTimeout( switchPlayerTurn(), 0);
                addToScreen(HTMLpiece, getActivePlayer());
            }
    }

    return {playRound};
})();

const pieces = document.querySelectorAll('.lilSquare');

pieces.forEach(piece => {
    piece.addEventListener('click', function() {
        displayController.playRound(piece);
    });
});
