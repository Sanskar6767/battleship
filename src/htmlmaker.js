import { Player, Ship } from './canvas.js';
// import { player1, player2 } from './gamestart.js';
import { getNewGame } from './gamestart.js';
import { writeMessage } from ".";
import { eventListener } from "./index.js";


export function buildBoardStart(wrapper) {
    const currentGame = getNewGame();
    const player1 = getNewGame().player1;
    const container = document.createElement('div');
    container.id = 'container-board';
    const div = document.createElement('div');
    div.classList.add('board-title');
    div.textContent = 'Your Board';
    const grid = document.createElement('div');
    grid.id = 'grid-board';
    player1.gameboard.board.forEach((row, x) => {
        row.forEach((cell, y) => {
            const cellDiv = document.createElement('div');
            cellDiv.classList.add('cell');
            cellDiv.dataset.tracking = `${x}-${y}`;
            if (cell instanceof Ship) {
                // cellDiv.classList.add('ship-cell');
                let shipPartDiv = document.createElement('div');
                shipPartDiv.classList.add('ship-part');
                shipPartDiv.dataset.shipId = cell.id;
                shipPartDiv.textContent = cell.id;
                cellDiv.appendChild(shipPartDiv);
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
export function buildBoard(wrapper) {
    const player1 = getNewGame().player1;
    const container = document.createElement('div');
    container.id = 'container-board';
    const div = document.createElement('div');
    div.classList.add('board-title');
    div.textContent = 'Your Board';
    const grid = document.createElement('div');
    grid.id = 'grid-board';
    
    player1.gameboard.board.forEach((row, x) => {
        row.forEach((cell, y) => {
            const cellDiv = document.createElement('div');
            cellDiv.classList.add('cell');
            cellDiv.dataset.tracking = `${x}-${y}`;

            if (cell instanceof Ship) {
                let shipPartDiv = document.createElement('div');
                shipPartDiv.classList.add('ship-part');
                shipPartDiv.dataset.shipId = cell.id;
                shipPartDiv.textContent = cell.id;

                // Make the ship part draggable
                shipPartDiv.setAttribute('draggable', true);

                // Add event listener for dragging
                shipPartDiv.addEventListener('dragstart', dragStart);

                cellDiv.appendChild(shipPartDiv);
            } else if (cell === 'Hit') {
                cellDiv.classList.add('hit-cell');
                cellDiv.textContent = 'X';
            } else if (cell === 'Miss') {
                cellDiv.classList.add('miss-cell');
                cellDiv.textContent = 'O';
            }

            // Add event listener for dragover and drop events
            cellDiv.addEventListener('dragover', dragOver);
            cellDiv.addEventListener('drop', dropShip);

            grid.appendChild(cellDiv);
        });
    });

    container.appendChild(div);
    container.appendChild(grid);
    wrapper.appendChild(container);
}



export function buildOpponentBoard(wrapper) {

    const newGame = getNewGame();
    const player2 = getNewGame().player2;

    const container = document.createElement('div');
    container.id = 'container-board-opponent';

    const div = document.createElement('div');
    div.classList.add('board-title');
    div.textContent = 'Opponent Board';

    const grid = document.createElement('div');
    grid.id = 'grid-boardopponent';
    
    player2.gameboard.board.forEach((row, x) => {
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

    buildBoardStart(leftPanel);
    buildOpponentBoard(rightPanel);
    arenaWrapper.appendChild(leftPanel);
    arenaWrapper.appendChild(center);
    arenaWrapper.appendChild(rightPanel);
    app.appendChild(arenaWrapper);
    writeMessage('Start attacking!');
    eventListener();
}



import { preArena } from './gamestart.js';
let draggedShipId = null;  // To store the dragged ship's ID
let initialCoordinates = null;  // To store the initial position of the dragged ship
let blockOffset = 0;  // To store the offset of the dragged block from the start of the ship
let shipStartCoordinates = null;  // To store the starting coordinates of the ship

// Called when the drag starts
// function dragStart(e) {
//     draggedShipId = e.target.dataset.shipId;  // Get the ship ID from the dragged part
//     const tracking = e.target.closest('.cell').dataset.tracking.split('-');  // Get the coordinates of the ship
//     console.log(tracking);
//     initialCoordinates = [parseInt(tracking[0]), parseInt(tracking[1])];  // Store initial position
//     console.log(`Dragging ship: ${draggedShipId} from ${initialCoordinates}`);
// }
function dragStart(e) {
    draggedShipId = e.target.dataset.shipId;  // Get the ship ID
    const tracking = e.target.closest('.cell').dataset.tracking.split('-');  // Get the coordinates of the clicked block
    const clickedX = parseInt(tracking[0]);
    const clickedY = parseInt(tracking[1]);

    let newGame = getNewGame();
    const playerBoard = newGame.player1.gameboard;
    const shipCoordinates = playerBoard.ships[draggedShipId];  // Get the ship's coordinates

    // Find out which block of the ship is being dragged
    initialCoordinates = [clickedX, clickedY];  // Store the initial coordinates of the clicked block
    shipStartCoordinates = shipCoordinates[0];  // Store the coordinates of the first block of the ship

    // Calculate the offset (how far the dragged block is from the start of the ship)
    if (shipCoordinates[0][0] === clickedX) {  // Horizontal ship
        blockOffset = clickedY - shipCoordinates[0][1];  // Horizontal offset
    } else {  // Vertical ship
        blockOffset = clickedX - shipCoordinates[0][0];  // Vertical offset
    }

    console.log(`Dragging ship: ${draggedShipId} from ${initialCoordinates}, offset: ${blockOffset}`);
}


// Called when an element is dragged over a grid cell (to allow drop)
function dragOver(e) {
    e.preventDefault();  // This allows the drop event to occur
}

// Called when the ship is dropped onto a grid cell
// function dropShip(e) {
//     const targetCoordinates = e.target.dataset.tracking.split('-');
//     const x = parseInt(targetCoordinates[0]);
//     const y = parseInt(targetCoordinates[1]);


//     let newGame = getNewGame();
//     const playerBoard = newGame.player1.gameboard;

//     // Get the ship and its details
//     const shipCoordinates = playerBoard.ships[draggedShipId];  // Get all coordinates of the ship
//     const ship = playerBoard.board[shipCoordinates[0][0]][shipCoordinates[0][1]]; // Get the ship object
//     const shipDirection = ship.direction;  // Use the current direction of the ship

//     // Temporarily remove the ship from the board for re-placement
//     playerBoard.removeShipFromBoard(draggedShipId);

//     // Attempt to place the ship at the new coordinates
//     ship.x = x;
//     ship.y = y;

//     if (playerBoard.canPlaceShip(ship, shipDirection)) {
//         // playerBoard.placeShip(ship, shipDirection);  // Re-place the ship in the new position
//         newGame.player1.placeShip(x, y, ship.length, draggedShipId, shipDirection);
//         console.log(`Ship ${draggedShipId} dropped at ${x}, ${y}`);
//         console.log(newGame.player1.gameboard.board);
//     } else {
//         // Revert the ship to its original position if placement is invalid
//         ship.x = initialCoordinates[0];
//         ship.y = initialCoordinates[1];
//         newGame.player1.placeShip(x, y, ship.length, draggedShipId, shipDirection);  // Re-place the ship at its original location
//         console.log(`Invalid drop, ship ${draggedShipId} returned to its original position`);
//     }

//     // Re-render the board to reflect changes
//     const wrapper = document.getElementById('wrapper');
//     wrapper.innerHTML = '';
//     preArena();
// }

function dropShip(e) {

    if (!e.target || !e.target.dataset.tracking) {
        console.error("Invalid drop target.");
        return;  // Stop the function if the drop target is invalid
    }
    
    const targetCoordinates = e.target.dataset.tracking.split('-');
    const x = parseInt(targetCoordinates[0]);
    const y = parseInt(targetCoordinates[1]);

    let newGame = getNewGame();
    const playerBoard = newGame.player1.gameboard;

    // Get the ship and its details using the ship's ID
    const shipCoordinates = playerBoard.ships[draggedShipId];  // Get all coordinates of the ship
    const ship = playerBoard.board[shipCoordinates[0][0]][shipCoordinates[0][1]];  // Get the actual ship object
    const shipDirection = ship.direction;  // Get the current direction of the ship

    // Remove the ship from its current position on the board
    playerBoard.removeShipFromBoard(draggedShipId);

    // Adjust the new starting position based on the block offset
    let newX = x, newY = y;
    if (shipDirection === 'horizontal') {
        newY = y - blockOffset;  // Adjust for horizontal offset
    } else {
        newX = x - blockOffset;  // Adjust for vertical offset
    }

    // Now try to place the ship at the new coordinates (starting at newX, newY)
    ship.x = newX;  // Update the ship's new starting x coordinate
    ship.y = newY;  // Update the ship's new starting y coordinate

    // Check if there's enough space to place the ship at the new position
    if (playerBoard.canPlaceShip(ship, shipDirection)) {
        // Place the entire ship at the new position
        newGame.player1.placeShip(newX, newY, ship.length, draggedShipId, shipDirection);
        console.log(`Ship ${draggedShipId} dropped at ${x}, ${y}`);
    } else {
        // If the placement is invalid, revert the ship to its original position
        newGame.player1.placeShip(initialCoordinates[0], initialCoordinates[1], ship.length, draggedShipId, shipDirection);
        console.log(`Invalid drop, ship ${draggedShipId} returned to its original position`);
    }

    // Re-render the board to reflect changes
    const wrapper = document.getElementById('wrapper');
    wrapper.innerHTML = '';
    preArena();
}






