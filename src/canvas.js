import { alertWin } from "./index";
import { writeMessage } from "./index";

export class Ship {
    constructor(x, y, length, id, isSunk = false) {
        this.x = x;
        this.y = y;
        this.id = id;
        this.length = length;
        this.timesHit = 0;
        this.isSunk = isSunk;
    }

    hit() {
        this.timesHit++;
        this.checkIfSunk();
    }

    checkIfSunk() {
        if (this.timesHit === this.length) {
            this.isSunk = true;
        }
    }
}


export class Gameboard {
    constructor(size = 10){
        this.size = size;
        this.board = this.createBoard();
        this.ships = {};
        this.hits = [];
        this.misses = [];
        this.shipsSunk = 0;
    }

    createBoard(){
        return Array(this.size).fill().map(() => Array(this.size).fill(null));
    }

    placeShip(ship, direction = 'horizontal'){
        const { x, y, length, id} = ship;
        const shipCoordinates = [];

        if (direction === 'horizontal') {
            if (y + length > this.size) {
                throw new Error("Ship placement exceeds board boundaries (horizontal).");
            }
            for (let i = 0; i < length; i++) {
                if (this.board[x][y + i] === null) {
                    this.board[x][y + i] = ship;
                    shipCoordinates.push([x, y + i]);  // Store the coordinates
                } else {
                    throw new Error("Invalid position or overlap detected.");
                }
            }
        } else if (direction === 'vertical') {
            if (x + length > this.size) {
                throw new Error("Ship placement exceeds board boundaries (vertical).");
            }
            for (let i = 0; i < length; i++) {
                if (this.board[x + i][y] === null) {
                    this.board[x + i][y] = ship;
                    shipCoordinates.push([x + i, y]);  // Store the coordinates
                } else {
                    throw new Error("Invalid position or overlap detected.");
                }
            }
        }

        // Add the ship's id and coordinates to the ships array
        this.ships[id] = shipCoordinates;
        ship.direction = direction;
    }

    receiveAttack(x, y, attacker) {
        let hit = false;
        const cell = this.board[x][y];  // Get the cell at the attack coordinates
        
        if (cell instanceof Ship) {  // If the cell contains a ship
            cell.hit();  // Call hit() method on the ship
            this.hits.push([x, y]);
            this.board[x][y] = 'Hit';  // Mark the board as hit
            hit = true;

            if (cell.isSunk) {
                if (attacker === 'computer') {
                    writeMessage(`Computer sunk a ship!`);
                    this.shipsSunk++;
                } else {
                    writeMessage(`You sunk a ship!`);
                    this.shipsSunk++;
                }
            }
        }
        
        if (!hit) {
            this.misses.push([x, y]);
            this.board[x][y] = 'Miss';  // Mark the board as miss
        }

    }
    

    allSunk(){
        if (this.shipsSunk === 4) {
            return true;
        }
    }

    getShipCoordinatesById(id) {
        return this.ships[id] || null;
    }

    clearBoard(){
        this.board = this.createBoard();
    }

    isAlreadyAttacked(x, y) {
        return this.board[x][y] === 'Hit' || this.board[x][y] === 'Miss';
    }

    getShipDirection(shipId) {
        const shipCoordinates = this.ships[shipId];
        const [x1, y1] = shipCoordinates[0];
        const [x2, y2] = shipCoordinates[1];
        if (x1 === x2) {
            return 'horizontal';
        } else {
            return 'vertical';
        }
    }

    canPlaceShip(ship, direction) {
        const { x, y, length} = ship;

        if (direction === 'horizontal') {
            if (y + length > this.size) {
                console.log('test 1');
                return false;
            }
            for (let i = 0; i < length; i++) {
                if (this.board[x][y + i] !== null) {
                    console.log('test 2');
                    return false;
                }
            }
        } else if (direction === 'vertical') {
            if (x + length > this.size) {
                console.log('test 3');
                return false;
            }
            for (let i = 0; i < length; i++) {
                if (this.board[x + i][y] !== null) {
                    console.log('test 4');
                    return false;
                }
            }
        }
        return true;
    }

    changeShipDirection(shipId) {
        const shipCoordinates = this.ships[shipId];  // Get the ship's current coordinates
        const ship = this.board[shipCoordinates[0][0]][shipCoordinates[0][1]];  // Get the ship object

        // Determine the new direction (toggle between horizontal and vertical)
        const newDirection = ship.direction === 'horizontal' ? 'vertical' : 'horizontal';

        // First, remove the ship from the board to prevent conflict with itself
        this.removeShipFromBoard(shipId);

        // Now, check if the new placement is valid in the new direction
        if (this.canPlaceShip(ship, newDirection)) {
            // If valid, place the ship in the new direction
            this.placeShip(ship, newDirection);
            console.log(`Ship ${shipId} direction changed to ${newDirection}`);
        } else {
            // If not valid, put the ship back in its original direction
            this.placeShip(ship, ship.direction);  // Place it back in the original direction
            console.log(`Not enough space to rotate ship ${shipId}`);
        }
    }

    // Method to remove a ship from the board
    removeShipFromBoard(shipId) {
        const shipCoordinates = this.ships[shipId];
        shipCoordinates.forEach(([x, y]) => {
            this.board[x][y] = null;  // Clear the ship's cells
        });
        this.ships[shipId] = [];  // Reset the ship's coordinates
    }

}

export class Player {
    constructor(type = 'human'){
        this.type = type;
        this.gameboard = new Gameboard();
    }

    placeShip(x, y, length, id, direction){
        let ship = new Ship(x, y, length, id);
        this.gameboard.placeShip(ship, direction);
    }
 
    attack(opponentGameboard, x , y, attacker) {
        if (attacker === 'computer') {
            opponentGameboard.receiveAttack(x, y, attacker);
        } else {
            opponentGameboard.receiveAttack(x, y, attacker);
        }
    }
}


