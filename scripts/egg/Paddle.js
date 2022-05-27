// Code for pong from Web Dev Simplified at https://www.youtube.com/watch?v=PeY6lXPrPaA

/** The speed of the computer's paddle. Higher numbers is faster, faster is more difficult. */
const SPEED = 0.01;

/**
 * Paddle. Represents a paddle in the game of pong. Contains methods to determine the x and 
 * y location of the paddle and the paddles bounding information.
 */
export default class Paddle {

  /**
   * constructor. Creates a paddle form a DOM element.
   * @param {DOM element} paddleElem - the element on the DOM to make a paddle.
   */
    constructor(paddleElem) {
        this.paddleElem = paddleElem;
        this.reset();
    }

    /**
     * get position. Returns the location of this paddle from the style property in egg.css.
     * @returns the location of this paddle.
     */
    get position() {
        return parseFloat(getComputedStyle(this.paddleElem).getPropertyValue("--position"));
    }

    /**
     * set position. Sets the position style property of this paddle in egg.css.
     * @param {float} value - the value with which to set the position property.
     */
    set position(value) {
        this.paddleElem.style.setProperty("--position", value);
    }

    /**
     * rect. Returns the bounding information of this paddle.
     * @returns the bounding coordinates of this paddle.
     */
    rect() {
        return this.paddleElem.getBoundingClientRect();
    }

    /**
     * reset. Sets the position of this paddle to halfway up the screen.
     */
    reset() {
        this.position = 50;
    }

    /**
     * update. Updates this paddles location information based on the height of the ball,
     * the speed of the paddle, and the change in time from the last call.
     * @param {float} delta - the time between frames.
     * @param {DOMrect} ballHeight - the bounding information of a ball.
     */
    update(delta, ballHeight) {
        this.position += SPEED * delta * (ballHeight - this.position);
    }
}