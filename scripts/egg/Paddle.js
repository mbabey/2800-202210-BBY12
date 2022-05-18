// Code for pong from Web Dev Simplified at https://www.youtube.com/watch?v=PeY6lXPrPaA

const SPEED = 0.01; // speed of the AI: faster = more difficult

export default class Paddle {
    constructor(paddleElem) {
        this.paddleElem = paddleElem;
        this.reset();
    }

    get position() {
        return parseFloat(getComputedStyle(this.paddleElem).getPropertyValue("--position"));
    }

    set position(value) {
        this.paddleElem.style.setProperty("--position", value);
    }

    rect() {
        return this.paddleElem.getBoundingClientRect();
    }

    reset() {
        this.position = 50;
    }

    update(delta, ballHeight) {
        this.position += SPEED * delta * (ballHeight - this.position);
    }
}