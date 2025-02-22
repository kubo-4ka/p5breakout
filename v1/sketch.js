let ball;
let paddles = [];
let walls = [];
let score = 0;

function setup() {
  createCanvas(400, 600);
  ball = new Ball();
  paddles.push(new Paddle(width / 2 - 50, height - 20, 100, 10));
  walls.push(new Wall(0, 0, 10, height));
  walls.push(new Wall(width - 10, 0, 10, height));
  walls.push(new Wall(0, 0, width, 10));
}

function draw() {
  background(0);
  
  ball.update();
  ball.show();
  
  for (let paddle of paddles) {
    paddle.show();
    if (ball.hits(paddle)) {
      ball.bounce();
      score += 10;
    }
  }
  
  for (let wall of walls) {
    wall.show();
    if (ball.hits(wall)) {
      ball.bounce();
    }
  }
  
  fill(255);
  textSize(16);
  text("Score: " + score, 10, 30);
  
  if (ball.offScreen()) {
    textSize(32);
    text("Game Over", width / 2 - 80, height / 2);
    noLoop();
  }
}

function keyPressed() {
  if (keyCode === LEFT_ARROW) {
    paddles[0].move(-10);
  } else if (keyCode === RIGHT_ARROW) {
    paddles[0].move(10);
  }
}

class Ball {
  constructor() {
    this.pos = createVector(width / 2, height / 2);
    this.vel = createVector(1, 1);
    this.r = 12;
  }

  update() {
    this.pos.add(this.vel);
  }

  show() {
    fill(255);
    ellipse(this.pos.x, this.pos.y, this.r * 2);
  }

  bounce() {
    this.vel.y *= -1;
  }

  hits(paddle) {
    let d = dist(this.pos.x, this.pos.y, paddle.pos.x + paddle.w / 2, paddle.pos.y);
    return (d < this.r + paddle.h / 2);
  }

  offScreen() {
    return (this.pos.y > height);
  }
}

class Paddle {
  constructor(x, y, w, h) {
    this.pos = createVector(x, y);
    this.w = w;
    this.h = h;
  }

  show() {
    fill(255);
    rect(this.pos.x, this.pos.y, this.w, this.h);
  }

  move(step) {
    this.pos.x += step;
    this.pos.x = constrain(this.pos.x, 0, width - this.w);
  }
}

class Wall {
  constructor(x, y, w, h) {
    this.pos = createVector(x, y);
    this.w = w;
    this.h = h;
  }

  show() {
    fill(255);
    rect(this.pos.x, this.pos.y, this.w, this.h);
  }

  hits(ball) {
    let d = dist(ball.pos.x, ball.pos.y, this.pos.x + this.w / 2, this.pos.y + this.h / 2);
    return (d < ball.r + min(this.w, this.h) / 2);
  }
}
