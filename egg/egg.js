// Code for pong from Web Dev Simplified at https://www.youtube.com/watch?v=PeY6lXPrPaA

import Ball from './Ball.js';
import Paddle from './Paddle.js';

const ball = new Ball(document.getElementById("ball"));
const playerPaddle = new Paddle(document.getElementById("player-paddle"));
const computerPaddle = new Paddle(document.getElementById("computer-paddle"));
const playerScoreElem = document.getElementById("player-score");
const computerScoreElem = document.getElementById("computer-score");

// Update loop: called every time something on the screen can change ie. every frame
let lastTime;
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

function isLose() {
  const rect = ball.rect();
  return rect.right >= window.innerWidth || rect.left <= 0;
}

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

['touchstart', 'touchmove', 'touchend', 'touchcancel', 'mousemove'].forEach((eventType) => {
  document.addEventListener(eventType, handlePaddleMovement, { passive: false });
});

// (Code adapted from https://stackoverflow.com/questions/41993176/determine-touch-position-on-tablets-with-javascript/61732450#61732450)
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

window.requestAnimationFrame(update);