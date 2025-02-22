let ball;
let paddles = [];
let walls = [];
let blocks = [];
let score = 0;
let leftPressed = false;
let rightPressed = false;
let gameState = 'title'; // 'title', 'playing', 'gameOver', 'gameClear'

function setup() {
  createCanvas(600, 400);
  createGameElements();
}

function createGameElements() {
  ball = new Ball();
  paddles = [new Paddle(width / 2 - 50, height - 20, 100, 10)];
  walls = [
    new Wall(0, 0, 10, height), // 左の壁
    new Wall(width - 10, 0, 10, height), // 右の壁
    new Wall(0, 0, width, 10) // 上の壁
  ];
  blocks = [];
  let rows = 5;
  let cols = 10;
  let blockWidth = 50;
  let blockHeight = 20;
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      blocks.push(new Block(j * blockWidth + 10, i * blockHeight + 40, blockWidth, blockHeight));
    }
  }
  score = 0;
  leftPressed = false;
  rightPressed = false;
}

function draw() {
  background(0);

  if (gameState === 'title') {
    drawTitleScreen();
  } else if (gameState === 'playing') {
    playGame();
  } else if (gameState === 'gameOver') {
    drawGameOverScreen();
  } else if (gameState === 'gameClear') {
    drawGameClearScreen();
  }
}

function drawTitleScreen() {
  fill(255);
  textSize(32);
  textAlign(CENTER);
  text("Breakout Game", width / 2, height / 2 - 20);
  textSize(16);
  text("Press Enter to Start", width / 2, height / 2 + 20);
}

function playGame() {
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

  for (let i = blocks.length - 1; i >= 0; i--) {
    blocks[i].show();
    if (ball.hitsBlock(blocks[i])) {
      ball.bounceOffBlock();
      blocks.splice(i, 1); // ブロックを削除
      score += 20;
    }
  }

  if (blocks.length === 0) {
    gameState = 'gameClear';
  }

  if (leftPressed) {
    paddles[0].move(-10);
  } else if (rightPressed) {
    paddles[0].move(10);
  }

  fill(255);
  textSize(16);
  text("Score: " + score, 60, 30);

  if (ball.offScreen()) {
    gameState = 'gameOver';
  }
}

function drawGameOverScreen() {
  fill(255);
  textSize(32);
  textAlign(CENTER);
  text("Game Over", width / 2, height / 2 - 20);
  textSize(16);
  text("Press Enter to Restart", width / 2, height / 2 + 20);
}

function drawGameClearScreen() {
  fill(255);
  textSize(32);
  textAlign(CENTER);
  text("Congratulations!", width / 2, height / 2 - 20);
  text("You cleared all the blocks!", width / 2, height / 2 + 20);
  textSize(16);
  text("Press Enter to Restart", width / 2, height / 2 + 60);
}

function keyPressed() {
  if (keyCode === LEFT_ARROW) {
    leftPressed = true;
  } else if (keyCode === RIGHT_ARROW) {
    rightPressed = true;
  } else if (keyCode === ENTER) {
    if (gameState === 'title' || gameState === 'gameOver' || gameState === 'gameClear') {
      createGameElements();
      gameState = 'playing';
    }
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

  bounceOffBlock() {
    this.vel.y *= -1;
  }

  hitsBlock(block) {
    return (
      this.pos.x + this.r > block.pos.x &&
      this.pos.x - this.r < block.pos.x + block.w &&
      this.pos.y + this.r > block.pos.y &&
      this.pos.y - this.r < block.pos.y + block.h
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

class Block {
  constructor(x, y, w, h) {
    this.pos = createVector(x, y);
    this.w = w;
    this.h = h;
  }

  show() {
    fill(255, 0, 0);
    rect(this.pos.x, this.pos.y, this.w, this.h);
  }
}
