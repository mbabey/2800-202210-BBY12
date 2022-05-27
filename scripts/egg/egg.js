// Code for pong from Web Dev Simplified at https://www.youtube.com/watch?v=PeY6lXPrPaA

import Ball from './Ball.js';
import Paddle from './Paddle.js';

/** The ball that this game will be played with. */
const ball = new Ball(document.getElementById("ball"));

/** The player paddle that this game wil be played with. */
const playerPaddle = new Paddle(document.getElementById("player-paddle"));

/** The computer paddle that this game wil be played with. */
const computerPaddle = new Paddle(document.getElementById("computer-paddle"));

/** The player score DOM element. */
const playerScoreElem = document.getElementById("player-score");

/** The computer score DOM element. */
const computerScoreElem = document.getElementById("computer-score");

/** The last time the update function was called. */
let lastTime;

// Event listeners for moving the player's paddle. 
['touchstart', 'touchmove', 'touchend', 'touchcancel', 'mousemove'].forEach((eventType) => {
  document.addEventListener(eventType, handlePaddleMovement, { passive: false });
});

window.requestAnimationFrame(update);

/**
 * update. Calculates the change in time between frames, then calls the update functions 
 * of the ball and paddles.
 * @param {float} time 
 */
function update(time) {
  if (lastTime != null) { // Update code: only update if we have a lastTime
    const delta = time - lastTime; // delta is the time between frames 
    ball.update(delta, [playerPaddle.rect(), computerPaddle.rect()]);
    computerPaddle.update(delta, ball.y);
    if (isLose()) handleLose();
  }

  lastTime = time;
  window.requestAnimationFrame(update);
}

/**
 * isLose. Determines if either player has lost the round.
 * @returns true if the ball leaves the play area, false otherwise.
 */
function isLose() {
  const rect = ball.rect();
  return rect.right >= window.innerWidth || rect.left <= 0;
}

/**
 * handleLose. Determines which side lost the round and updates the scores accordingly.
 * Then, resets the game.
 */
function handleLose() {
  const rect = ball.rect();
  if (rect.right >= window.innerWidth) {
    playerScoreElem.textContent = parseInt(playerScoreElem.textContent) + 1;
  } else {
    computerScoreElem.textContent = parseInt(computerScoreElem.textContent) + 1;
  }

  ball.reset();
  computerPaddle.reset();
}

/**
 * handlePaddleMovement. Updates the player paddle's position based on the player's actions.
 * (Code adapted from https://stackoverflow.com/questions/41993176/determine-touch-position-on-tablets-with-javascript/61732450#61732450)
 * @param {Event} e - the event used to determine the position of the paddle.
 */
function handlePaddleMovement(e) {
  let y;
  if (e.type == 'touchstart' || e.type == 'touchmove' || e.type == 'touchend' || e.type == 'touchcancel') {
    let touch = e.touches[0] || e.changedTouches[0];
    y = touch.pageY;
  } else if (e.type == 'mousemove') {
    y = e.clientY;
  }
  playerPaddle.position = (y / window.innerHeight) * 100;
}
