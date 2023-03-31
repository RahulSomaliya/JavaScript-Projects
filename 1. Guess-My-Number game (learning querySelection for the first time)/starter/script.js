function updateResultText(newMessage) {
  document.querySelector('.message').textContent = newMessage;
}

function updateHighScore() {
  const score = Number(document.querySelector('.score').textContent);
  if (score > document.querySelector('.highscore').textContent) {
    document.querySelector('.highscore').textContent = score;
  }
}

function updateDisplayedNumber(newValue) {
  document.querySelector('.number').textContent = newValue || '?';
}

function disableInputAndCheckBtn(state) {
  document.querySelector('.guess').disabled = state;
  document.querySelector('.check').disabled = state;
}

function checkResult() {
  const guessedNumber = document.querySelector('.guess').value;
  if (!guessedNumber) {
    updateResultText(`Please enter your guess first!👀`);
    return;
  }
  if (guessedNumber == randomNumber) {
    updateResultText(`Congrats! 🎉`);
    updateHighScore();
    updateDisplayedNumber(guessedNumber);
    disableInputAndCheckBtn(true);
    updateWinningCss();
  } else {
    document.querySelector('.score').textContent--;
    if (document.querySelector('.score').textContent == 0) {
      updateResultText(`You've lost the game! 💣`);
      disableInputAndCheckBtn(true);
      return;
    }
    const difference = Math.abs(guessedNumber - randomNumber);
    const highOrLow =
      Math.sign(guessedNumber - randomNumber) === 1 ? `high` : `low`;
    if (difference <= 2) {
      updateResultText(`You're just a bit ${highOrLow}er!  😀`);
    } else if (difference <= 7) {
      updateResultText(`You're guessing too ${highOrLow}! 😄`);
    } else if (difference <= 15) {
      updateResultText(`You're too far ${highOrLow}! 😁`);
    } else if (difference > 15) {
      updateResultText(`You're quite too ${highOrLow}! 😶‍🌫️`);
    }
  }
}

function generateRandomNumberBetween1to20() {
  const randomNumber = Math.trunc(Math.random() * 20) + 1;
  return randomNumber;
}

function resetGame() {
  randomNumber = generateRandomNumberBetween1to20();
  disableInputAndCheckBtn(false);
  updateDisplayedNumber();
  document.querySelector('.guess').value = '';
  document.querySelector('.message').textContent = 'Start guessing...';
  document.querySelector('.score').textContent = '20';
  document.querySelector('body').style.backgroundColor = '#222';
  document.querySelector('.number').style.width = '15rem';
}

function updateWinningCss() {
  document.querySelector('body').style.backgroundColor = '#60b347';
  document.querySelector('.number').style.width = '30rem';
}

let randomNumber = generateRandomNumberBetween1to20();

document.querySelector('.check').addEventListener('click', checkResult);
document.querySelector('.again').addEventListener('click', resetGame);
