'use strict';

document.querySelector('.btn--roll').addEventListener('click', handleRollEvent);
document.querySelector('.btn--new').addEventListener('click', resetGame);
const holdButtonElement = document.querySelector('.btn--hold');
holdButtonElement.addEventListener('click', handleHoldEvent);

const diceImage = document.querySelector('.dice');

function rollDice() {
  return Math.trunc(Math.random() * 6) + 1;
}

function handleRollEvent() {
  diceRoll = rollDice();
  updateDiceImage();
  updateCurrentScore();
  updateHoldButtonState(true);
}

function updateHoldButtonState(show) {
  holdButtonElement.style.display = show ? 'block' : 'none';
}

function handleHoldEvent() {
  if (currentPlayer === 1) {
    playerOneTotalScoreElement.textContent =
      Number(playerOneTotalScoreElement.textContent) +
      Number(playerOneCurrentScoreElement.textContent);
    playerOneCurrentScoreElement.textContent = 0;
  } else {
    playerTwoTotalScoreElement.textContent =
      Number(playerTwoTotalScoreElement.textContent) +
      Number(playerTwoCurrentScoreElement.textContent);
    playerTwoCurrentScoreElement.textContent = 0;
  }
  updatePlayerTurn();
}

function updateDiceImage() {
  if (!diceRoll) {
    diceImage.style.display = 'none';
  } else {
    diceImage.src = diceRoll ? `dice-${diceRoll}.png` : ``;
    diceImage.style.display = 'block';
  }
}

function updateCurrentScore() {
  if (diceRoll === 1) {
    updatePlayerTurn();
  } else {
    if (currentPlayer === 1) {
      playerOneCurrentScoreElement.textContent =
        Number(playerOneCurrentScoreElement.textContent) + diceRoll;
    } else {
      playerTwoCurrentScoreElement.textContent =
        Number(playerTwoCurrentScoreElement.textContent) + diceRoll;
    }
  }
}

function updatePlayerTurn() {
  updateHoldButtonState(false);
  if (currentPlayer === 1) {
    playerOneCurrentScoreElement.textContent = 0;
  } else {
    playerTwoCurrentScoreElement.textContent = 0;
  }
  currentPlayer = currentPlayer === 1 ? 2 : 1;
  activePlayerClass();
}

function activePlayerClass() {
  if (currentPlayer === 1) {
    playerOneSection.classList.add('player--active');
    playerTwoSection.classList.remove('player--active');
  } else {
    playerTwoSection.classList.add('player--active');
    playerOneSection.classList.remove('player--active');
  }
}

function resetGame() {
  diceRoll = 0;
  currentPlayer = 1;
  activePlayerClass();
  updateDiceImage();
  updateHoldButtonState(false);

  playerOneTotalScoreElement.textContent = 0;
  playerTwoTotalScoreElement.textContent = 0;

  playerOneCurrentScoreElement.textContent = 0;
  playerTwoCurrentScoreElement.textContent = 0;
}

let diceRoll;
let currentPlayer = 1; // 1 => player one, 2 => player 2 is currently playing

let playerOneSection = document.querySelector('.player--0');
let playerOneCurrentScoreElement = document.querySelector('#current--0');
let playerOneTotalScoreElement = document.querySelector('#score--0');

let playerTwoSection = document.querySelector('.player--1');
let playerTwoCurrentScoreElement = document.querySelector('#current--1');
let playerTwoTotalScoreElement = document.querySelector('#score--1');

resetGame();
