import { alertWin, eventListener, writeMessage } from "./index";
import { buildBoard, buildOpponentBoard } from "./htmlmaker";
import { Gameboard } from './canvas';
import { Player } from "./canvas";

export class Game {
    constructor(){
        this.player1 = new Player('human');
        this.player2 = new Player('computer');
        this.currentPlayer = this.player1;
    }

    switchPlayer(){
        this.currentPlayer = this.currentPlayer === this.player1 ? this.player2 : this.player1;
    }

    playTurn(x, y) {
        const opponentBoard = this.currentPlayer === this.player1 ? this.player2.gameboard : this.player1.gameboard;
        
        this.currentPlayer.attack(opponentBoard, x, y);
        this.switchPlayer(); // Current player is not the computer
        this.refreshBoards(this.currentPlayer);

        if(this.checkWin(this.currentPlayer)){
            writeMessage('You won!');
            this.player1.gameboard.clearBoard();
            this.player2.gameboard.clearBoard();
            alertWin();
            return;
        }

        // computer's chance to attack 
        if(this.currentPlayer === this.player2){
            this.computerTurn();
        }
        
    }

    refreshBoards(player) {
        if (player === this.player1) {
            const leftPanel = document.querySelector('.left-panel');
            leftPanel.innerHTML = '';
            buildBoard(leftPanel);
        } else {
            const rightPanel = document.querySelector('.right-panel');
            rightPanel.innerHTML = '';
            buildOpponentBoard(rightPanel);
        }
    }
    
    checkWin(player) {
        // Check if any player's ships are all sunk
        if (player.gameboard.allSunk()) {
            return true;
        }
        return false;
    }

    resetGame() {
        this.player1.gameboard.clearBoard(); // Reset the board
        this.player2.gameboard.clearBoard(); // Reset the board
        // this.startNewGame(); // Reinitialize ships and state
    }

    computerTurn(){
        this.computerMove();
        this.switchPlayer();
        this.refreshBoards(this.currentPlayer);
        if(this.checkWin(this.currentPlayer)){
            writeMessage('Computer won!');
            alertWin();
            return;
        }
        eventListener();
    }

    computerMove() {
        let x, y;
        
        // Generate random coordinates for the computer attack
        do {
            x = Math.floor(Math.random() * this.player1.gameboard.size); // Assuming board size is known
            y = Math.floor(Math.random() * this.player1.gameboard.size);
        } while (this.player1.gameboard.isAlreadyAttacked(x, y)); // Prevent attacking the same spot
    
        this.player2.attack(this.player1.gameboard, x, y);
        console.log(`Computer attacked: ${x}, ${y}`);
    }
    
    
    
}