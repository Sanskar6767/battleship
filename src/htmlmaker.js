import { Player, Ship } from './canvas.js';
// import { player1, player2 } from './gamestart.js';
import { newGame } from './gamestart.js';
import { writeMessage } from ".";
import { eventListener } from "./index.js";


export function buildBoard(wrapper) {
    const container = document.createElement('div');
    container.id = 'container-board';
    const div = document.createElement('div');
    div.classList.add('board-title');
    div.textContent = 'Your Board';
    const grid = document.createElement('div');
    grid.id = 'grid-board';
    newGame.player1.gameboard.board.forEach((row, x) => {
        row.forEach((cell, y) => {
            const cellDiv = document.createElement('div');
            cellDiv.classList.add('cell');
            cellDiv.dataset.tracking = `${x}-${y}`;
            // cellDiv.id = `${x}-${y}`;
            if (cell instanceof Ship) {
                cellDiv.classList.add('ship-cell');
            } else if (cell === 'Hit') {
                cellDiv.classList.add('hit-cell');
                cellDiv.textContent = 'X';
            } else if (cell === 'Miss') {
                cellDiv.classList.add('miss-cell');
                cellDiv.textContent = 'O';
            }
            grid.appendChild(cellDiv);
        });
    });
    container.appendChild(div);
    container.appendChild(grid);
    wrapper.appendChild(container);
}


export function buildOpponentBoard(wrapper) {

    const container = document.createElement('div');
    container.id = 'container-board-opponent';

    const div = document.createElement('div');
    div.classList.add('board-title');
    div.textContent = 'Opponent Board';

    const grid = document.createElement('div');
    grid.id = 'grid-boardopponent';
    
    newGame.player2.gameboard.board.forEach((row, x) => {
        row.forEach((cell, y) => {
            const cellDiv = document.createElement('div');
            cellDiv.classList.add('cell');
            cellDiv.classList.add('hover');
            cellDiv.dataset.tracking = `${x}-${y}`;
            // cellDiv.id = `${x}-${y}`;
            if (cell === 'Hit') {
                cellDiv.classList.add('hit-cell');
                cellDiv.classList.remove('hover');
                cellDiv.textContent = 'X';
            } else if (cell === 'Miss') {
                cellDiv.classList.add('miss-cell');
                cellDiv.classList.remove('hover');
                cellDiv.textContent = 'O';
            }
            grid.appendChild(cellDiv);
        });
    });
    container.appendChild(div);
    container.appendChild(grid);
    wrapper.appendChild(container);
}

export function createArena() {
    const app = document.getElementById('app');

    const arenaWrapper = document.createElement('div');
    arenaWrapper.classList.add('arena-wrapper');

    const leftPanel = document.createElement('div');
    leftPanel.classList.add('left-panel');
    const rightPanel = document.createElement('div');
    rightPanel.classList.add('right-panel');
    const center = document.createElement('div');
    center.classList.add('center-panel');

    buildBoard(leftPanel);
    buildOpponentBoard(rightPanel);
    arenaWrapper.appendChild(leftPanel);
    arenaWrapper.appendChild(center);
    arenaWrapper.appendChild(rightPanel);
    app.appendChild(arenaWrapper);
    writeMessage('Start attacking!');
    eventListener();
}






