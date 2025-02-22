let ball;
let paddles = [];
let walls = [];
let score = 0;
let leftPressed = false;
let rightPressed = false;

function setup() {
  createCanvas(400, 600);
  ball = new Ball();
  paddles.push(new Paddle(width / 2 - 50, height - 20, 100, 10));
  walls.push(new Wall(0, 0, 10, height)); // 左の壁
  walls.push(new Wall(width - 10, 0, 10, height)); // 右の壁
  walls.push(new Wall(0, 0, width, 10)); // 上の壁
}

function draw() {
  background(0);

  ball.update();
  ball.show();

  for (let paddle of paddles) {
    paddle.show();
    if (ball.hitsPaddle(paddle)) {
      ball.bounceOffPaddle();
      score += 10;
    }
  }

  for (let wall of walls) {
    wall.show();
    if (ball.hitsWall(wall)) {
      ball.bounceOffWall(wall);
    }
  }

  // スムーズなパドル移動
  if (leftPressed) {
    paddles[0].move(-10);
  } else if (rightPressed) {
    paddles[0].move(10);
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
    leftPressed = true;
  } else if (keyCode === RIGHT_ARROW) {
    rightPressed = true;
  }
}

function keyReleased() {
  if (keyCode === LEFT_ARROW) {
    leftPressed = false;
  } else if (keyCode === RIGHT_ARROW) {
    rightPressed = false;
  }
}

class Ball {
  constructor() {
    this.pos = createVector(width / 2, height / 2);
    this.vel = createVector(-3, -3);
    this.r = 12;
  }

  update() {
    this.pos.add(this.vel);
  }

  show() {
    fill(255);
    ellipse(this.pos.x, this.pos.y, this.r * 2);
  }

  bounceOffPaddle() {
    this.vel.y *= -1;
  }

  hitsPaddle(paddle) {
    return (
      this.pos.y + this.r > paddle.pos.y &&
      this.pos.x > paddle.pos.x &&
      this.pos.x < paddle.pos.x + paddle.w
    );
  }

  bounceOffWall(wall) {
    if (wall.w > wall.h) {
      this.vel.y *= -1;
    } else {
      this.vel.x *= -1;
    }
  }

  hitsWall(wall) {
    return (
      this.pos.x + this.r > wall.pos.x &&
      this.pos.x - this.r < wall.pos.x + wall.w &&
      this.pos.y + this.r > wall.pos.y &&
      this.pos.y - this.r < wall.pos.y + wall.h
    );
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
}
