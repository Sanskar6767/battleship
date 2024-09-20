import { Player, Ship } from "./canvas";
import { Game } from "./game";
import { buildBoard, createArena, buildOpponentBoard } from "./htmlmaker";
import { eventListener } from ".";

// export const player1 = new Player();
// export const player2 = new Player('computer');
export const newGame = new Game();
const app = document.getElementById('app');



export function preStart() {
    console.log(newGame.currentPlayer.gameboard.board);
    placingShips();
    const wrapper = document.createElement('div');
    wrapper.id = 'wrapper';
    buildBoard(wrapper);
    const button = document.createElement('button');
    button.id = 'start';
    button.textContent = 'Start Game';
    // here i will add event listener to the button
    wrapper.appendChild(button);
    app.appendChild(wrapper);
    button.addEventListener('click', startGame);
}


export function startGame() {
    console.log('Game started');
    const wrapper = document.getElementById('wrapper');
    wrapper.remove();
    createArena();
}

function placingShips() {
    newGame.player1.placeShip(3, 3, 4, 'vertical');
    newGame.player1.placeShip(5, 5, 3, 'horizontal');
    newGame.player1.placeShip(7, 7, 3, 'vertical');
    newGame.player1.placeShip(1, 1, 5, 'horizontal');
    // currentPlayer.placeShip(9, 9, 2, 'horizontal'); error

    newGame.player2.placeShip(1, 1, 5, 'horizontal');
    newGame.player2.placeShip(4, 4, 3, 'vertical');
    newGame.player2.placeShip(6, 6, 3, 'horizontal');
    // opponent.placeShip(8, 8, 3, 'vertical');
    // opponent.placeShip(9, 9, 2, 'horizontal'); error
}



export function updateBoard(player) {

    if (player === newGame.player1) {
        const leftPanel = document.querySelector('.left-panel');
        leftPanel.innerHTML = '';
        buildBoard(leftPanel);
        
    } else {
        const rightPanel = document.querySelector('.right-panel');
        rightPanel.innerHTML = '';
        buildOpponentBoard(rightPanel);
        newGame.computerMove();
        newGame.switchPlayer();
        updateBoard(newGame.currentPlayer);
        eventListener();

    }
    // eventListener();
}



export function handleAttack(e) {
    const cell = e.target;
    if (!cell.classList.contains('hover')) {
        return;
    }
    const [x, y] = cell.dataset.tracking.split('-');

    newGame.playTurn(+x, +y);
    // newGame.handleAttack(x, y);
    // updateBoard(newGame.currentPlayer);

    // newGame.player2.gameboard.receiveAttack(+x, +y);
    // newGame.switchPlayer();
    // updateBoard(newGame.currentPlayer);
    // console.log(newGame.player2.gameboard.board);
}




