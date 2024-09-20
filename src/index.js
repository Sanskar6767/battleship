import '../assets/css/style.css';
import * as canvas from './canvas';
import { createHomePage } from './htmlmaker';

import { newGame, preStart } from './gamestart';
import { startGame, handleAttack } from './gamestart';

export let WIN = false;

preStart();
// startGame();

export function alertWin() {
    // const app = document.getElementById('app');
    // app.innerHTML = '';
    // // app.innerHTML = '';
    // preStart();
}

// add event listener to the grid-board
export function eventListener() {
    document.getElementById('grid-boardopponent').addEventListener('click', handleAttack);
}

export function writeMessage(message) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message');
    const center = document.querySelector('.center-panel');
    center.innerHTML = '';
    center.appendChild(messageDiv);

    // Clear the content initially
    messageDiv.textContent = '';

    // Typewriter animation
    let i = 0;
    const typingSpeed = 30; // Speed in milliseconds

    function typeWriter() {
        if (i < message.length) {
            messageDiv.textContent += message.charAt(i);
            i++;
            setTimeout(typeWriter, typingSpeed);
        }
    }

    // Start the typewriter effect
    typeWriter();
}



