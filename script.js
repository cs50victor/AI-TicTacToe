window.onload = () =>{
    let origBoard;
    const aiPlayer = "O";
    const humPlayer = "X";
    const winCombos = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[6,4,2]]

    //getting an array for all the cells in the TIC TAC TEO grid 
    let cells = document.querySelectorAll('.cell');
    //initializing the game
    startGame();
    document.getElementById("reset").addEventListener("click", startGame);

    // when the game starts or the game has been restarted.
    function startGame() {
        // fancy way to generate an array containing number 1-9
        origBoard = Array.from(Array(9).keys());
        //clears each cell content and background color, listens for click then calls the turnClick(square)
        for (let i = 0; i < cells.length; i++) {
            cells[i].innerText = "";
            cells[i].style.removeProperty('background-color');
            cells[i].addEventListener('click', turnClick, false);
            cells[i].classList.remove("blocked");
            document.querySelector(".endgame-text").innerText = '';
        }
    }
    

    function turnClick(square){
        // checking if the the clicked cell has a number id
        // when the AI or human plays the origBoard's value for that cell turns to either "X" or "O"
        // this statement stop players from clicking twice during the game
        if (typeof origBoard[square.target.id] == 'number') {
            turn(square.target.id, humPlayer)
            //on each click check if the game has been won.
            // if there is no winner or tie, the AI plays turn(bestSpot())
            if (!checkWin(origBoard, humPlayer) && !checkTie()) turn(bestSpot(), aiPlayer);
        }
    }

    function turn(squareId, player) {
        origBoard[squareId] = player;
        document.getElementById(squareId).innerText = player;
        let gameWon = checkWin(origBoard, player)
        //if game has been won, (gameWon= true) call gameOver function that connects to checkWin.
        if (gameWon) gameOver(gameWon)
    }

    function checkWin(board, player) {
        // finding every index that the player has played in.
        // a- accumulator array, e-element, i-index
        let plays = board.reduce((a, e, i) =>
            (e === player) ? a.concat(i) : a, []);
        let gameWon = null;
        // looping to find -has the player played in all the possible cells to win the game?
        for (let [index, win] of winCombos.entries()) {
            if (win.every(elem => plays.indexOf(elem) > -1)) {
                gameWon = {index: index, player: player};
                break;
            }
        }
        return gameWon;
    }
    // function to highlight backgrounds and make it impossible to keep playing.
    function gameOver(gameWon) {
        for (let index of winCombos[gameWon.index]) {
            // if ai wins background color is red, if human wins background is red.
            document.getElementById(index).style.backgroundColor = gameWon.player == humPlayer ? "green" : "pink";
        }
        // removing event listeners , so the cells don't take clicks and changing the cursor
        for (let i = 0; i < cells.length; i++) {
            cells[i].removeEventListener('click', turnClick, false);
            cells[i].classList.add("blocked");
        }
        declareWinner(gameWon.player == humPlayer ? "You won!" : "You lost.");
    }

    function declareWinner(who) {
        document.querySelector(".endgame-text").innerText = who;
    }

    function emptySquares() {
        // filter and return the cells that don't have strings, and still have numbers
        return origBoard.filter(s => typeof s == "number");
    }

    function bestSpot() {
        // returning index from minimax's object
        return minimax(origBoard, aiPlayer).index;
    }

    function checkTie() {
        // if there are no empty squares
        if (emptySquares().length == 0) {
            // change al cell's background color to pink and remove click listener.
            for (let i = 0; i < cells.length; i++) {
                cells[i].style.backgroundColor = "bisque";
                cells[i].removeEventListener('click', turnClick, false);
                cells[i].classList.add("blocked");
            }
            declareWinner("It's a Tie!")
            return true;
        }
        return false;
    }
    //          Recursive AI minimax algorithm
    // https://www.freecodecamp.org/news/how-to-make-your-tic-tac-toe-game-unbeatable-by-using-the-minimax-algorithm-9d690bad4b37/

    function minimax(newBoard, player) {
        let availSpots = emptySquares();

        if (checkWin(newBoard, humPlayer)) {
            return {score: -10};
        } else if (checkWin(newBoard, aiPlayer)) {
            return {score: 10};
        } else if (availSpots.length === 0) {
            return {score: 0};
        }
        let moves = [];
        for (let i = 0; i < availSpots.length; i++) {
            let move = {};
            move.index = newBoard[availSpots[i]];
            newBoard[availSpots[i]] = player;

            if (player == aiPlayer) {
                let result = minimax(newBoard, humPlayer);
                move.score = result.score;
            } else {
                let result = minimax(newBoard, aiPlayer);
                move.score = result.score;
            }

            newBoard[availSpots[i]] = move.index;

            moves.push(move);
        }

        let bestMove;
        if(player === aiPlayer) {
            let bestScore = -10000;
            for(let i = 0; i < moves.length; i++) {
                if (moves[i].score > bestScore) {
                    bestScore = moves[i].score;
                    bestMove = i;
                }
            }
        } else {
            let bestScore = 10000;
            for(let i = 0; i < moves.length; i++) {
                if (moves[i].score < bestScore) {
                    bestScore = moves[i].score;
                    bestMove = i;
                }
            }
        }

        return moves[bestMove];
    }
}