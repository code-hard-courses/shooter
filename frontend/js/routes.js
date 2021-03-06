import { initializeGame, startGame } from './main';
import { getScoreFromDatabase } from './utils/requestUtils';
import { game } from './main';
import { BUFF_PARAMS, INTERVALS } from './constants';

const spriteWrapper = document.querySelector('.sprite-wrapper');
const gameContainer = document.querySelector('.game-container');
const imageDataArray = [
  { src: "./img/hero.png", className: "hero-sprite" },
  { src: "./img/sword.png", className: "sword" },
  { src: "./img/shoes.png", className: "shoes" },
  { src: "./img/shield.png", className: "shield" },
  { src: "./img/landscape.png", className: "landscape" },
  { src: "./img/ice-demon.png", className: "ice-demon" },
  { src: "./img/mashroom.png", className: "mashroom" }
]

let requestTimer;

const routes = [
  {
    match: '',
    onEnter: () => {
      window.location.hash = 'game';
    }
  }, {
    match: 'game',
    onEnter: () => {
      changeStyleToGameDisplay();
      changeActivePage('game');
      gameContainer.innerHTML = generateGameContent();
      if (!spriteWrapper.innerHTML) {
        addSpriteContentAndInitializeGame(spriteWrapper, initializeGame);
      } else {
        initializeGame();
      }
    },
    onLeave: () => {
      changeStyleToInformationDisplay();
      unsubscribeAndClearCurrentGameState();
      removeActivePage('game');
    }
  }, {
    match: 'scores',
    onEnter: () => {
      changeActivePage('scores');
      requestTimer = simulateLongHttpRequest();
    },
    onLeave: () => {
      clearInterval(requestTimer);
      removeActivePage('scores');
    }
  }, {
    match: 'rules',
    onEnter: () => {
      changeActivePage('rules');
      gameContainer.innerHTML = generateRulesContent();
    },
    onLeave: () => {
      removeActivePage('rules');
    }
  }, {
    match: 'author',
    onEnter: () => {
      changeActivePage('author');
      gameContainer.innerHTML = generateAuthorContent();
    },
    onLeave: () => {
      removeActivePage('author');
    }
  },
]

function unsubscribeAndClearCurrentGameState() {
  game.stopGameAndClearState();
  clearInterval(game.replay.spriteTimer);
  clearInterval(game.replay.positionTimer);
  document.removeEventListener('keydown', initializeGame)
  document.removeEventListener('keydown', startGame)
}

function simulateLongHttpRequest() {
  gameContainer.innerHTML = '<div class="arena"><div class="lds-ripple"><div></div><div></div></div></div>';
  return setTimeout(() =>
    getScoreFromDatabase()
      .then(res => gameContainer.innerHTML = generateScoreContent(res))
    , 1000)
}

function changeActivePage(newPage) {
  document.querySelector(`[href="#${newPage}"]`).classList.add('active');
}

function removeActivePage(page) {
  document.querySelector(`[href="#${page}"]`).classList.remove('active');
}

function changeStyleToGameDisplay() {
  gameContainer.classList.add('arena')
}

function changeStyleToInformationDisplay() {
  gameContainer.classList.remove('arena')
}

function generateScoreContent(scores) {
  const listItems = scores.map((item, i) =>
    `<li class="list-group-item d-flex justify-content-between align-items-center">
      ${i + 1}) ${item.name}
      <span class="badge badge-primary badge-pill">${item.score}</span>
    </li>`).join('');

  return `<div class="container margin-top">
            <h4>Best scores:</h4>
            <ul class="list-group">
              <li class="list-group-item d-flex justify-content-between align-items-center">
                Username:
                <span>Score:</span>
              </li>
              ${listItems}
            </ul>
          </div>`;
}

function addSpriteContentAndInitializeGame(container, cb) {
  let loadCounter = 0;
  imageDataArray.forEach(img => {
    const newImage = new Image();
    newImage.className = img.className;
    newImage.src = img.src;
    newImage.onload = () => {
      loadCounter++
      if (loadCounter === imageDataArray.length) {
        cb();
      }
    };
    container.appendChild(newImage);
  })
}

function generateGameContent() {
  return `
  <div class="level-container">
    Level:
    <span class="level">1</span>
  </div>
  <div class="score-container">
    Score:
    <span class="score">0</span>
  </div>
  <div class="speed-container">
    Speed:
    <span class="speed">0</span>
  </div>
  <div class="replay-container">
    <button class="btn">Show replay</button>
  </div>
  <canvas></canvas>
  `
}
function generateRulesContent() {
  return `<div class="container margin-top">
            <h3>Rules:</h3>
            <h5>Mechanics:</h5>
            <p>The game is about of hero and his enemies. User can manipulate the hero
                with arrow buttons <code>🠀 🠁🠃 🠂</code> where push of each change hero direction 
                to the arrow direction. Also you can stop hero, with
                <code>Ctrl</code> button. </p> Game finish when any of the enemies catches hero.
            <p>Hero has ability to shoot with his gun to the nearest enemies. User do it with the
                mouse, shoot action occurs if user press
                <code>left button</code> mouse. Hero has speed acceleration if moves to one direction. If
                he changes it, current hero speed discard to minimum.
            </p>
            <h5>Enemies:</h5>
            <p>There are several enemies: ice golems, who move only with start direction,
                and mashrooms - smart enemy, who begin to pursue if see hero at some range. Mashrooms have
                 an ability to increase his size, speed and defense by eating another mashroom.
            </p>
            <h5>Buffs:</h5>
            <p>Average buff time is <code>${BUFF_PARAMS.buffTime / 1000}</code> seconds. Hero can activate buff if catches it. 
                At the game every <code>${INTERVALS.addBuffItem / 1000}</code> seconds generates new buff and on the field can be only one buff
                item. Hero can stack buffs if catches more than one. There are several buffs at the game:</p>
            <p>
                <img src="./img/sword.png"> - improve hero's gun size and damage. <span class="red">Red</span> line indicator 
                appears when hero take this buff.
            </p>
            <p>
                <img src="./img/shoes.png"> - improve hero's speed and when the buff activated decrease speed
                of all enemies at game field. <span class="blue">Blue</span> line indicator appears when hero take this buff.
            </p>
            <p>
                <img src="./img/shield.png"> - make hero immortal. Smart enemies begin to run away from the hero.
                <span class="black">Black</span> line indicator appears when hero take this buff.
            </p>
            <h5>Lvl up and score:</h5>
            <p>Every <code>${INTERVALS.lvlUp / 1000}</code> seconds hero reach new level. With each new level at game field
                creates a stack of dummy enemies. Amount of creatures at the stack
                is equalent to the new level. Also every new level the size of creatures
                and speed of dummy enemies increases. Score is equalent to the time
                that hero present at game field.
            </p>
            <p>Good luck and enjoy!</p>
          </div>`
}

function generateAuthorContent() {
  return `<div class="container margin-top">
            <h3>Author page:</h3>
            <p>Hello, my name is Evgeniy and i'm the author of the game. If you have any
            questions you can find me here <a href="https://www.linkedin.com/in/evgeniy-dainovich/">LinkenIn</a>
            </p>
            <p>Game is developed with Javascript and Bootstrap for styling.</p>
          </div>`
}

export default routes;