// =============================================
//  RETRO SNAKE GAME — game.js
//  Vanilla JS + HTML5 Canvas, no dependencies
// =============================================

'use strict';

// --- Constants ---
const GRID_SIZE       = 20;   // cells per side
const CELL_SIZE       = 20;   // px per cell (canvas = 400x400)
const BASE_SPEED      = 150;  // ms per tick
const SPEED_INCREMENT = 10;   // ms reduction per milestone
const MIN_SPEED       = 60;   // fastest allowed tick
const SCORE_PER_FOOD  = 10;
const SPEED_MILESTONE = 5;    // every N segments, speed increases
const LS_KEY          = 'retroSnake_highScore';

// --- DOM References ---
const canvas          = document.getElementById('gameCanvas');
const ctx             = canvas.getContext('2d');
const scoreDisplay    = document.getElementById('score-display');
const highScoreDisplay= document.getElementById('high-score-display');
const startScreen     = document.getElementById('start-screen');
const pauseScreen     = document.getElementById('pause-screen');
const gameoverScreen  = document.getElementById('gameover-screen');
const finalScore      = document.getElementById('final-score');
const finalHighscore  = document.getElementById('final-highscore');
const newHSBadge      = document.getElementById('new-highscore-badge');
const btnPause        = document.getElementById('btn-pause');
const btnPlayAgain    = document.getElementById('btn-play-again');

// --- Game State ---
let state = {};
let loopTimer = null;

// =============================================
//  INITIALISATION
// =============================================

function init() {
  // Clear any running loop
  if (loopTimer !== null) {
    clearTimeout(loopTimer);
    loopTimer = null;
  }

  state = {
    snake: [
      { x: 10, y: 10 },
      { x: 9,  y: 10 },
      { x: 8,  y: 10 },
    ],
    direction:     { x: 1, y: 0 },
    nextDirection: { x: 1, y: 0 },
    food:          { x: 0, y: 0 },
    score:         0,
    highScore:     loadHighScore(),
    status:        'IDLE',   // 'IDLE' | 'RUNNING' | 'PAUSED' | 'GAMEOVER'
    speed:         BASE_SPEED,
    tickCount:     0,
  };

  spawnFood();
  updateHUD();
  showScreen('start');
  render();
}

// =============================================
//  GAME LOOP
// =============================================

function gameLoop() {
  if (state.status !== 'RUNNING') return;

  update();
  render();

  loopTimer = setTimeout(gameLoop, state.speed);
}

// =============================================
//  UPDATE
// =============================================

function update() {
  applyDirection();
  moveSnake();
  if (state.status !== 'RUNNING') return; // collision may have ended the game
  checkFoodCollision();
  updateSpeed();
  state.tickCount++;
}

function applyDirection() {
  state.direction = { ...state.nextDirection };
}

function moveSnake() {
  const head = state.snake[0];
  const newHead = {
    x: head.x + state.direction.x,
    y: head.y + state.direction.y,
  };

  // Check wall collision
  if (
    newHead.x < 0 || newHead.x >= GRID_SIZE ||
    newHead.y < 0 || newHead.y >= GRID_SIZE
  ) {
    triggerGameOver();
    return;
  }

  // Check self-collision (skip first segment = old head position)
  for (let i = 0; i < state.snake.length; i++) {
    if (state.snake[i].x === newHead.x && state.snake[i].y === newHead.y) {
      triggerGameOver();
      return;
    }
  }

  state.snake.unshift(newHead);
  // Tail is popped UNLESS food was just eaten (handled in checkFoodCollision)
  // We use a flag on state to communicate between moveSnake and checkFoodCollision
  state._justAte = false;

  const food = state.food;
  if (newHead.x === food.x && newHead.y === food.y) {
    state._justAte = true;
  } else {
    state.snake.pop();
  }
}

function checkFoodCollision() {
  if (state._justAte) {
    updateScore(SCORE_PER_FOOD);
    spawnFood();
    state._justAte = false;
  }
}

function updateSpeed() {
  // Speed increases every SPEED_MILESTONE segments beyond initial 3
  const extraSegments = state.snake.length - 3;
  if (extraSegments > 0 && extraSegments % SPEED_MILESTONE === 0) {
    const newSpeed = BASE_SPEED - Math.floor(extraSegments / SPEED_MILESTONE) * SPEED_INCREMENT;
    state.speed = Math.max(newSpeed, MIN_SPEED);
  }
}

// =============================================
//  FOOD
// =============================================

function spawnFood() {
  let pos;
  do {
    pos = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
  } while (state.snake.some(seg => seg.x === pos.x && seg.y === pos.y));
  state.food = pos;
}

// =============================================
//  SCORE
// =============================================

function updateScore(points) {
  state.score += points;
  scoreDisplay.textContent = state.score;
}

function updateHUD() {
  scoreDisplay.textContent    = state.score;
  highScoreDisplay.textContent = state.highScore;
}

function loadHighScore() {
  const saved = localStorage.getItem(LS_KEY);
  return saved ? parseInt(saved, 10) : 0;
}

function saveHighScore() {
  if (state.score > state.highScore) {
    state.highScore = state.score;
    localStorage.setItem(LS_KEY, state.highScore);
    highScoreDisplay.textContent = state.highScore;
    return true; // new high score
  }
  return false;
}

// =============================================
//  GAME FLOW
// =============================================

function startGame() {
  showScreen(null);
  state.status = 'RUNNING';
  gameLoop();
}

function togglePause() {
  if (state.status === 'RUNNING') {
    state.status = 'PAUSED';
    showScreen('pause');
    btnPause.textContent = '▶ RESUME';
  } else if (state.status === 'PAUSED') {
    state.status = 'RUNNING';
    showScreen(null);
    btnPause.textContent = '⏸ PAUSE';
    gameLoop();
  }
}

function triggerGameOver() {
  state.status = 'GAMEOVER';
  if (loopTimer !== null) {
    clearTimeout(loopTimer);
    loopTimer = null;
  }

  const isNewHS = saveHighScore();

  finalScore.textContent      = state.score;
  finalHighscore.textContent  = state.highScore;
  newHSBadge.classList.toggle('hidden', !isNewHS);

  render(); // draw final frame
  showScreen('gameover');
}

function restartGame() {
  btnPause.textContent = '⏸ PAUSE';
  init();
  // Immediately start instead of showing start screen again
  showScreen(null);
  state.status = 'RUNNING';
  gameLoop();
}

// =============================================
//  SCREEN MANAGEMENT
// =============================================

function showScreen(name) {
  // name: 'start' | 'pause' | 'gameover' | null
  startScreen.classList.toggle('hidden',   name !== 'start');
  pauseScreen.classList.toggle('hidden',   name !== 'pause');
  gameoverScreen.classList.toggle('hidden', name !== 'gameover');
}

// =============================================
//  RENDERING
// =============================================

function render() {
  drawBackground();
  drawFood();
  drawSnake();
}

function drawBackground() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#000010';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Faint grid lines
  ctx.strokeStyle = 'rgba(0, 245, 255, 0.04)';
  ctx.lineWidth = 0.5;
  for (let i = 0; i <= GRID_SIZE; i++) {
    ctx.beginPath();
    ctx.moveTo(i * CELL_SIZE, 0);
    ctx.lineTo(i * CELL_SIZE, canvas.height);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, i * CELL_SIZE);
    ctx.lineTo(canvas.width, i * CELL_SIZE);
    ctx.stroke();
  }
}

function drawFood() {
  const { x, y } = state.food;
  const px = x * CELL_SIZE;
  const py = y * CELL_SIZE;
  const padding = 3;

  // Pulsing glow based on time
  const pulse = Math.sin(Date.now() / 250) * 4 + 8;

  ctx.save();
  ctx.shadowColor = '#ff3131';
  ctx.shadowBlur  = pulse;
  ctx.fillStyle   = '#ff3131';
  ctx.fillRect(px + padding, py + padding, CELL_SIZE - padding * 2, CELL_SIZE - padding * 2);

  // Inner highlight
  ctx.fillStyle = '#ff8080';
  ctx.fillRect(px + padding, py + padding, 4, 4);
  ctx.restore();
}

function drawSnake() {
  ctx.save();
  state.snake.forEach((seg, i) => {
    const px = seg.x * CELL_SIZE;
    const py = seg.y * CELL_SIZE;
    const isHead = i === 0;

    ctx.shadowColor = '#39ff14';
    ctx.shadowBlur  = isHead ? 14 : 6;
    ctx.fillStyle   = isHead ? '#39ff14' : (i % 2 === 0 ? '#28b800' : '#22a000');

    ctx.fillRect(px + 1, py + 1, CELL_SIZE - 2, CELL_SIZE - 2);

    // Head accent
    if (isHead) {
      ctx.fillStyle = '#80ff60';
      ctx.fillRect(px + 2, py + 2, 5, 5);
    }
  });
  ctx.restore();
}

// =============================================
//  INPUT HANDLING
// =============================================

document.addEventListener('keydown', (e) => {
  switch (e.key) {
    // Movement — only when RUNNING
    case 'ArrowUp':
    case 'w':
    case 'W':
      e.preventDefault();
      if (state.status === 'RUNNING' && state.direction.y !== 1)
        state.nextDirection = { x: 0, y: -1 };
      break;

    case 'ArrowDown':
    case 's':
    case 'S':
      e.preventDefault();
      if (state.status === 'RUNNING' && state.direction.y !== -1)
        state.nextDirection = { x: 0, y: 1 };
      break;

    case 'ArrowLeft':
    case 'a':
    case 'A':
      e.preventDefault();
      if (state.status === 'RUNNING' && state.direction.x !== 1)
        state.nextDirection = { x: -1, y: 0 };
      break;

    case 'ArrowRight':
    case 'd':
    case 'D':
      e.preventDefault();
      if (state.status === 'RUNNING' && state.direction.x !== -1)
        state.nextDirection = { x: 1, y: 0 };
      break;

    // Pause / Resume
    case 'p':
    case 'P':
      if (state.status === 'RUNNING' || state.status === 'PAUSED')
        togglePause();
      break;

    // Enter — Start or Restart
    case 'Enter':
      if (state.status === 'IDLE')      startGame();
      else if (state.status === 'GAMEOVER') restartGame();
      break;
  }
});

// Button listeners
btnPause.addEventListener('click', () => {
  if (state.status === 'RUNNING' || state.status === 'PAUSED')
    togglePause();
});

btnPlayAgain.addEventListener('click', restartGame);

// Start screen click-to-start
startScreen.addEventListener('click', () => {
  if (state.status === 'IDLE') startGame();
});

// =============================================
//  BOOT
// =============================================

init();
