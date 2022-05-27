// Code for pong from Web Dev Simplified at https://www.youtube.com/watch?v=PeY6lXPrPaA

/** The initial speed for the ball. */
const INITIAL_VELOCITY = 0.025;

/** The rate at which the ball speed increases over time. */
const VELOCITY_SCALE = 0.000005;

/**
 * Ball. Represents the ball in the game of pong. Contains getters and setters for 
 * location and methods to determine the ball's physical bounding. Also contains a 
 * method to update the ball's position.
 */
export default class Ball {

  /**
   * constructor. Creates a ball.
   * @param {DOM element} ballElem - the element on the DOM to be made a ball.
   */
  constructor(ballElem) {
    this.ballElem = ballElem;
    this.reset();
  }

  /**
   * get x. Returns the x location of the ball from the style property in egg.css.
   * @returns the x location of this ball.
   */
  get x() {
    return parseFloat(getComputedStyle(this.ballElem).getPropertyValue("--x"));
  }

  /**
   * set x. Sets the x location style property in egg.css.
   * @param {float} newX - the value with which to set the x location.
   */
  set x(newX) {
    this.ballElem.style.setProperty("--x", newX);
  }

  
  /**
   * get y. Returns the y location of the ball from the style property in egg.css.
   * @returns the y location of this ball.
   */
  get y() {
    return parseFloat(getComputedStyle(this.ballElem).getPropertyValue("--y"));
  }

  
  /**
   * set y. Sets the y location style property in egg.css.
   * @param {float} newY - the value with which to set the y location.
   */
  set y(newY) {
    this.ballElem.style.setProperty("--y", newY);
  }

  /**
   * rect. Returns the ball's bounding coordinates. Used to determine collison.
   * @returns the bounding information of this ball.
   */
  rect() {
    return this.ballElem.getBoundingClientRect();
  }

  /**
   * reset. Resets the ball to the center of the screen and gives it a push in a 
   * pseudo-random direction.
   */
  reset() {
    this.x = 50;
    this.y = 50;
    this.direction = { x: 0 };
    while (Math.abs(this.direction.x) <= .2 || Math.abs(this.direction.x) >= .9) {
      const heading = getRandomArbitrary(0, 2 * Math.PI);
      this.direction = { x: Math.cos(heading), y: Math.sin(heading) };
    }
    this.velocity = INITIAL_VELOCITY;
  }

  /**
   * update. Updates the ball's location information based on its direction of movement, 
   * its speed, and the change in time. If the ball hits a paddle or the bottom/top of 
   * the screen, reverses its direction
   * @param {float} delta - the time between frames.
   * @param {DOMrect} paddleRects - the bounding information of the paddles.
   */
  update(delta, paddleRects) {
    this.x += this.direction.x * this.velocity * delta;
    this.y += this.direction.y * this.velocity * delta;
    this.velocity += VELOCITY_SCALE * delta;
    const rect = this.rect();

    if (rect.bottom >= window.innerHeight || rect.top <= 0) {
      this.direction.y *= -1;
    }

    if (paddleRects.some(r => isCollision(r, rect))) {
      this.direction.x *= -1;
    }
  }
}

/**
 * getRandomArbitrary. Returns a random number within a range.
 * @param {*} min - the minimum of the range
 * @param {*} max - the maximum of the range
 * @returns a random number in the range.
 */
function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}

/**
 * isCollision. Determines whether the ball has collided with one of the paddles.
 * @param {*} rect1 - the player's paddle
 * @param {*} rect2 - the AI's paddle
 * @returns true if a collision has occurred, false otherwise.
 */
function isCollision(rect1, rect2) {
  return (
    rect1.left <= rect2.right &&
    rect1.right >= rect2.left &&
    rect1.top <= rect2.bottom &&
    rect1.bottom >= rect2.top
  );
}
