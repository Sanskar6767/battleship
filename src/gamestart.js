import { Player, Ship, Gameboard } from "./canvas";
import { Game } from "./game";
import { buildBoard, createArena, buildOpponentBoard } from "./htmlmaker";
import { eventListener } from ".";

let editingBoard = true;

// export const player1 = new Player();
// export const player2 = new Player('computer');
// export const newGame = new Game();
let newGame = new Game();
export function resetNewGame() {
    if (newGame) {
        newGame.fullReset();
    } else {
        newGame = new Game();
    }
}
export function getNewGame() {
    return newGame;  // Export a getter to access the current game
}

const app = document.getElementById('app');



export function preStart() {
    console.log(newGame.currentPlayer.gameboard.board);
    editingBoard = true;
    placingShips();
    preArena();
    

}

export function preArena() {
    if (document.getElementById('wrapper')){
        const wrapper = document.getElementById('wrapper');
        wrapper.remove();
    }
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
    shipPlacement();
}

export function startGame() {
    editingBoard = false;
    console.log('Game started');
    const wrapper = document.getElementById('wrapper');
    wrapper.remove();
    createArena();
}

function placingShips() {
    console.log('Placing ships');
    let player1 = getNewGame().player1;
    let player2 = getNewGame().player2;
    // let [x, y] = getCoordinates(5);
    // let [x1, y1] = getCoordinates(3);
    // let [x2, y2] = getCoordinates(3);
    // let [x3, y3] = getCoordinates(4);
    player1.placeShip(3, 3, 4, 1, 'vertical');
    player1.placeShip(3, 5, 3, 2, 'horizontal');
    player1.placeShip(7, 7, 3, 3, 'vertical');
    player1.placeShip(1, 1, 5, 4, 'horizontal');
    // currentPlayer.placeShip(9, 9, 2, 'horizontal'); error

    player2.placeShip(1, 1, 5, 11, 'horizontal');
    player2.placeShip(4, 4, 3, 12, 'vertical');
    player2.placeShip(6, 6, 3, 13, 'horizontal');
    player2.placeShip(8, 3, 4, 14, 'horizontal');
    // opponent.placeShip(8, 8, 3, 'vertical');
    // opponent.placeShip(9, 9, 2, 'horizontal'); error
}

function shipPlacement() {
    document.querySelectorAll('.ship-part').forEach(cell => {
        cell.addEventListener('click', e => {
            const shipId = e.target.dataset.shipId;
            const ship = newGame.currentPlayer.gameboard.ships[shipId];
            const shipSize = ship.length;
            const shipDirection = newGame.currentPlayer.gameboard.getShipDirection(shipId);
            console.log(shipId, shipSize, shipDirection);
            newGame.player1.gameboard.changeShipDirection(shipId);
            const wrapper = document.getElementById('wrapper');
            wrapper.innerHTML = '';
            preArena();
        });
    })
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
    
}

// function getCoordinates(shipsize) {
//     do{
//         let x = prompt('Enter the x coordinate of size ' + shipsize);
//         let y = prompt('Enter the y coordinate of size ' + shipsize);
//     } while (x < 0 || x > 9 || y < 0 || y > 9);
    
//     return [x, y];
// }




