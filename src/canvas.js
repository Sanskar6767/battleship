import { alertWin } from "./index";
import { writeMessage } from "./index";


export class Ship {
    constructor(x, y, length, isSunk = false) {
        this.x = x;
        this.y = y;
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
        this.ships = [];
        this.hits = [];
        this.misses = [];
        this.shipsSunk = 0;
    }

    createBoard(){
        return Array(this.size).fill().map(() => Array(this.size).fill(null));
    }

    placeShip(ship, direction = 'horizontal'){
        const { x, y, length } = ship;
        if (direction === 'horizontal') {
            for (let i = 0; i < length; i++) {
                if (this.board[x] && this.board[x][y + i] === null) {
                    // x is row (vertical axis), y is column (horizontal axis)
                    this.board[x][y + i] = ship;
                } else {
                    throw new Error("Invalid position or overlap detected");
                }
            }
        } else if (direction === 'vertical') {
            for (let i = 0; i < length; i++) {
                if (this.board[x + i] && this.board[x + i][y] === null) {
                    // x is row (vertical axis), y is column (horizontal axis)
                    this.board[x + i][y] = ship;
                } else {
                    throw new Error("Invalid position or overlap detected");
                }
            }
        }
    }

    receiveAttack(x, y) {
        let hit = false;
        const cell = this.board[x][y];  // Get the cell at the attack coordinates
        
        if (cell instanceof Ship) {  // If the cell contains a ship
            cell.hit();  // Call hit() method on the ship
            this.hits.push([x, y]);
            this.board[x][y] = 'Hit';  // Mark the board as hit
            hit = true;
            if (cell.isSunk) {
                writeMessage(`You sunk a ship!`);
                this.shipsSunk++;
            }
        }
        
        if (!hit) {
            this.misses.push([x, y]);
            this.board[x][y] = 'Miss';  // Mark the board as miss
        }

    }
    

    allSunk(){
        if (this.shipsSunk === 3) {
            return true;
        }
    }

    clearBoard(){
        this.board = this.createBoard();
    }

    isAlreadyAttacked(x, y) {
        return this.board[x][y] === 'Hit' || this.board[x][y] === 'Miss';
    }

}

export class Player {
    constructor(type = 'human'){
        this.type = type;
        this.gameboard = new Gameboard();
    }

    placeShip(x, y, length, direction){
        let ship = new Ship(x, y, length);
        this.gameboard.placeShip(ship, direction);
    }
 
    attack(opponentGameboard, x , y) {
        
        opponentGameboard.receiveAttack(x, y);
    }
}


