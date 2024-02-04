"use strict";

document.getElementById('start-btn').addEventListener('click', resetBoard);

const FOUND_MATCH_WAIT_MSECS = 1000;
const COLORS = [
  "red", "blue", "green", "orange", "purple", "yellow",
  "red", "blue", "green", "orange", "purple", "yellow"
];

let revealed = [];
let winScore = 6;
let pairs = 0;
let guesses = 0;
const colors = shuffle(COLORS);


/** Shuffle array items in-place and return shuffled array. */

function shuffle(items) {
  // This algorithm does a "perfect shuffle", where there won't be any
  // statistical bias in the shuffle (many naive attempts to shuffle end up not
  // be a fair shuffle). This is called the Fisher-Yates shuffle algorithm; if
  // you're interested, you can learn about it, but it's not important.

  for (let i = items.length - 1; i > 0; i--) {
    // generate a random index between 0 and i
    let j = Math.floor(Math.random() * i);
    // swap item at i <-> item at j
    [items[i], items[j]] = [items[j], items[i]];
  }

  return items;
}

/** Create card for every color in colors (each will appear twice)
 *
 * Each div DOM element will have:
 * - a class with the value of the color
 * - a click event listener for each card to handleCardClick
 */

function createCards(colors) {
  const gameBoard = document.getElementById("game");
  for (let color of colors) {
    let card = document.createElement('div');
    card.classList.add(color);
    card.classList.add('card-down');
    card.addEventListener('click', handleCardClick);
    gameBoard.appendChild(card);
  }
}

/** Flip a card face-up. */

function flipCard(card) {
  card.classList.remove('card-down')
  card.removeEventListener('click', handleCardClick);
}

/** Flip a card face-down. */

function unFlipCard(card) {
  card.classList.add('card-down');
  card.addEventListener('click', handleCardClick);
}


function handleCardClick(evt) {
  let card = evt.target; // target element --> this is what triggered the event, the DOM element that sas clicked

  flipCard(card);

  revealed.push(card);
  if (revealed.length === 2) {
    guesses++
    score.innerText = `Guesses: ${guesses}`;

    //remove event listeners so no other cards can be clicked
    let unrevealed = document.getElementsByClassName('card-down')
    for (let cards of unrevealed) {
      cards.removeEventListener('click', handleCardClick);
    }

    setTimeout(pairCheck, 1000);


  }

}

function pairCheck() {


  if (String(revealed[0].classList) === String(revealed[1].classList)) { // pair
    pairs++

    if (pairs === winScore) { // winner
      let header = document.querySelector('h1');
      let h3 = document.querySelector('h3');
      let h4 = document.querySelector('h4')
      let score = document.getElementById('score');

      header.innerText = 'All Pairs Found! Congrats :)';
      if (guesses === 6) {
        h3.innerText = `You played a perfect game! Woah!`;
      } else {
        h3.innerText = `Try to win with less than ${guesses} guesses next time!`;
      }
      h4.innerText = 'Hit "New Game" to try again';
      score.style.backgroundColor = 'white';

    }

  } else { // not pair
    unFlipCard(revealed[0]);
    unFlipCard(revealed[1]);
  }

  revealed = [];

  let unrevealed = document.getElementsByClassName('card-down');
  for (let cards of unrevealed) {
    cards.addEventListener('click', handleCardClick);
  }

}


// resets our game, removes our current cards from the game table

function resetBoard() {
  pairs = 0;
  guesses = 0;

  let header = document.querySelector('h1');
  header.innerHTML = 'Welcome to my Memory Game!'

  let h3 = document.querySelector('h3');
  h3.innerText = 'Win with the least amount of guesses'

  let h4 = document.querySelector('h4');
  h4.innerText = 'Good Luck!';

  let gameBoard = document.getElementById('game');
  gameBoard.style.backgroundColor= '#DBCDC6';
  gameBoard.innerHTML = '';

  let score = document.getElementById('score');
  score.innerText = 'Guesses: 0'
  score.style.backgroundColor = '';


  createCards(shuffle(COLORS));

}
