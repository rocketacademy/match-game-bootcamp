/* <----- CSS Class Names ----> */

const CLASS_CARD_ITEMS = `match-card-items`;

const CLASS_CARD_ROW = `match-card-row`;
const CLASS_CARD = `match-card`;
const CLASS_CARD_SUIT = `match-card-suit`;
const CLASS_CARD_NAME = `match-card-name`;

const CLASS_BANNER = `match-banner`;

const CLASS_GAME_DESC = `match-game-desc`;

const CLASS_ROOT = `match-root`;

/* <----- CONFIG ----> */

const BOARD_SIDE_DEFAULT = 4;
const TIME_DEFAULT_DELAY_PAUSE = 3000;
const TIME_DEFAULT_DELAY_FLASH_ON_MATCHED = 3000;

const MS_PER_SEC = 1000;
const SEC_PER_MIN = 60;
const TIME_DEFAULT_GAME_DURATION = 3 * SEC_PER_MIN * MS_PER_SEC;

const TIME_DEFAULT_TIME_CHECK_INTERVAL = 100;

const TIME_DEFAULT_SETTINGS = {
  pause: TIME_DEFAULT_DELAY_PAUSE,
  onMatched: TIME_DEFAULT_DELAY_FLASH_ON_MATCHED,
  gameDuration: TIME_DEFAULT_GAME_DURATION,
  timeCheckInterval: TIME_DEFAULT_TIME_CHECK_INTERVAL,
};
const DEFAULT_CARD_COLOR = `lavender`;
/* <----- CARDS ----> */

const shuffleCards = (cards) => {
  const length = cards.length;
  for (let i = 0; i < length; i += 1) {
    const j = Math.floor(Math.random() * (length - i)) + i;
    [cards[i], cards[j]] = [cards[j], cards[i]];
  }
  return cards;
};

const MAX_RANK = 13;
const SUITS = ["❤️", "💎", "♣️", "♠️"];

/**
 *
 * @param {*} noOfPairs Number of pairs. This method generates a total of (noOfPairs * 2) cards.
 * @param {*} shuffle Shuffle if true.
 * @returns
 */
const makeShuffledDeck = (noOfPairs, shuffle = true) => {
  const newDeck = [];

  const lengthSuit = SUITS.length;

  let suitIndex = 0;
  let pairIndex = 0;
  while (pairIndex < noOfPairs) {
    suitIndex += 1;
    suitIndex %= lengthSuit;
    const currentSuit = SUITS[suitIndex];
    const rankCounter = pairIndex % MAX_RANK;
    let cardName = ``;
    if (rankCounter === 1) {
      cardName = `A`;
    } else if (rankCounter === 11) {
      cardName = `J`;
    } else if (rankCounter === 12) {
      cardName = `👸`;
    } else if (rankCounter === 0) {
      cardName = `👑`;
    } else {
      cardName = `${rankCounter}`;
    }
    const card = {
      name: cardName,
      suit: currentSuit,
      rank: rankCounter,
    };

    newDeck.push(card); // same obj ref
    newDeck.push(card);

    pairIndex += 1;
  }

  if (shuffle) {
    shuffleCards(newDeck);
  }

  return newDeck;
};

const newCardGrid = (boardSide) => {
  const height = (width = boardSide);
  const boardSize = height * width;
  // boardSize % 2 === 0;
  const pairs = boardSize / 2;
  const cards = makeShuffledDeck(pairs);
  const board = [];
  for (let i = 0; i < height; i += 1) {
    const row = [];
    for (let j = 0; j < width; j += 1) {
      row.push(cards.pop());
    }
    board.push(row);
  }
  return [board, boardSize];
};

/* <----- UI Helpers ----> */

const detachAllChildren = (element) => {
  while (element.lastChild) {
    element.removeChild(element.lastChild);
  }
};

const setBackGroundColor = (element, color) =>
  (element.style.backgroundColor = color);

const newElementDurationTime = () => {
  const element = document.createElement(`div`);
  return element;
};
const newElementCardSuit = (suit) => {
  const element = document.createElement(`div`);
  element.innerText = `${suit}`;
  element.className += ` ${CLASS_CARD_SUIT}`;
  return element;
};

const newElementCardName = (suit) => {
  const element = document.createElement(`div`);
  element.innerText = `${suit}`;
  element.className += ` ${CLASS_CARD_NAME}`;
  return element;
};

// TODO move addEventListener to new helper
const newElementCardAndSetClickHandle = (cardItem, game) => {
  const element = document.createElement(`div`);
  element.className += ` ${CLASS_CARD}`;
  element.addEventListener(`click`, () => {
    if (cardItem.faceUp) {
      console.warn(`already face up.....`);
      return;
    }
    if (isGameStop(game)) {
      console.warn(`Game stopped.`);
      return;
    }
    if (isGamePause(game)) {
      console.warn(`Game is paused`);
      return;
    }
    flipUp(cardItem);
    addActiveCardItem(game, cardItem);

    const activeCardsLength = getActiveCardsLength(game);
    if (activeCardsLength === 2) {
      settle(game);
    }
  });
  cardItem.element = element;
  return element;
};

const newElementGameDesc = (freezeTime) => {
  const element = document.createElement(`div`);
  element.innerHTML = `Click two cards, you will have a short viewing time of ${freezeTime}ms if cards are not matching. Game ends when all cards open. glhf!`;
  element.className += ` ${CLASS_GAME_DESC}`;
  return element;
};

/* <----- Logic Helpers ----> */

const isGamePause = (game) => game.state.isPause;
const isGameStop = (game) => game.state.isStop;
const pauseGame = (game) => {
  console.log(`game pause`);
  game.state.isPause = true;
};
const unPauseGame = (game) => {
  if (isGameStop(game)) {
    console.log(`cannot pause`);
    return;
  }
  console.log(`game unpause`);
  game.state.isPause = false;
};

const stopGame = (game) => {
  console.log(`💎🤲  GAMESTOP 💎🤲 `);
  game.state.isStop = true;
};

const isAllPairsMatch = (game) => game.state.unMatchedCardsCount === 0;

const getActiveCardsLength = (game) => game.state.activeCardItemsFlipped.length;

const isMatchingCards = (cardA, cardB) => cardA === cardB;

// Called when pair matches.
const registerMatchingPair = (game) => {
  game.state.unMatchedCardsCount -= 2; //
};

/* <----- UI-Logic Helpers ----> */

const flipDown = (cardItem) => {
  const { element } = cardItem;
  detachAllChildren(element);
  setBackGroundColor(element, ``);
  cardItem.faceUp = false;
};

const flipUp = (cardItem) => {
  const { element, value } = cardItem;
  const { suit, name } = value;
  const elementCardSuit = newElementCardSuit(suit);
  const elementCardName = newElementCardName(name);
  setBackGroundColor(element, DEFAULT_CARD_COLOR);
  element.replaceChildren(elementCardName, elementCardSuit);
  cardItem.faceUp = true;
};

const unflipActiveCards = (cardItems) => {
  for (const cardItem of cardItems) {
    flipDown(cardItem);
  }
};

const addActiveCardItem = (game, cardItem) => {
  const { element } = cardItem;
  element.style.border = `1px solid #9acd32`;
  game.state.activeCardItemsFlipped.push(cardItem);
};

const showMatcheeMatchee = (game) => {
  const { __elementRoot: elementParent, __timeSettings: timeSettings } = game;
  const { onMatched: onMatchedTime } = timeSettings;
  const element = document.createElement(`div`);
  element.className += ` match-hit`;
  element.innerText = `HITTO`;
  console.log(`appending ${onMatchedTime}`);
  console.log(element);

  elementParent.appendChild(element);
  setTimeout(() => {
    elementParent.removeChild(element);
    console.log(`time out match hit desc`);
  }, onMatchedTime);
};

// Reconciliation after every two clicks.
const settle = (game) => {
  console.group(`[settle] Two cards clicked.`);
  const { state, __timeSettings: timeSettings } = game;
  const { activeCardItemsFlipped } = state;

  // activeCardItemsFlipped.length === 2;

  const [cardItemA, cardItemB] = activeCardItemsFlipped;

  if (isMatchingCards(cardItemA.value, cardItemB.value)) {
    console.log(`Matching!`);
    registerMatchingPair(game);
    deactiveActiveCardItems(game);

    if (isAllPairsMatch(game)) {
      console.log(`WIN`);

      document.getElementById(
        `header`
      ).innerHTML = ` 🔥🚀🔥🚀🔥 ON FIRE 🔥🚀🔥🚀🔥 `;
      pauseGame(game);
    } else {
      showMatcheeMatchee(game);
    }
  } else {
    console.log(`Not Matching!`);
    pauseGame(game);
    setTimeout(() => {
      unPauseGame(game);
      unflipActiveCards(activeCardItemsFlipped);
      deactiveActiveCardItems(game);
    }, timeSettings.pause);
  }

  console.groupEnd();
};

// Clean up function after every two clicks
const deactiveActiveCardItems = (game) => {
  const activeCardsItem = game.state.activeCardItemsFlipped;
  for (const cardItem of activeCardsItem) {
    const { element } = cardItem;
    element.style.border = `1px solid black`;
  }
  game.state.activeCardItemsFlipped = [];
};

/* <----- DRIVER ----> */

const clearGameDisplay = (game) => {
  const { __elementRoot: elementRoot } = game;
  console.log(`detaching`);
  console.log(elementRoot);
  detachAllChildren(elementRoot);
};

const commencePreGame = (game) => {
  const { __elementRoot: elementRoot, __defaultElements } = game;
  const { elementGameDesc } = __defaultElements;

  const elementStartGameButton = document.createElement(`button`);
  const elementStartGameButtonDesc = document.createTextNode(`Start Game`);

  elementStartGameButton.appendChild(elementStartGameButtonDesc);

  elementRoot.appendChild(elementGameDesc);
  elementRoot.appendChild(elementStartGameButton);

  elementStartGameButton.addEventListener(`click`, () => {
    clearGameDisplay(game);
    startGame(game);
  });
};

const getDurationLeft = (endTime) => endTime - new Date();

const setTimeValueLeft = (timerItem) =>
  (timerItem.value.durationLeft = getDurationLeft(timerItem.value.endTime));
const setTimerElementDurationLeft = (timerItem) =>
  (timerItem.element.innerText = `${timerItem.value.durationLeft}ms`);

const exceedTime = (timerItem) => timerItem.value.durationLeft < 0;
const startTimer = (game) => {
  const { timerItem, __timeSettings: timeSettings } = game;
  const { gameDuration, timeCheckInterval } = timeSettings;

  const endTime = new Date();
  endTime.setMilliseconds(endTime.getMilliseconds() + gameDuration);
  timerItem.value = { endTime: endTime, durationLeft: null };

  setTimeValueLeft(timerItem);
  setTimerElementDurationLeft(timerItem);
  const gameDurationCountDownInterval = setInterval(() => {
    console.log(`timer started`);
    setTimeValueLeft(timerItem);
    setTimerElementDurationLeft(timerItem);

    if (exceedTime(timerItem)) {
      clearInterval(gameDurationCountDownInterval);
      stopGame(game);
    }
  }, timeCheckInterval);
};
const startGame = (game) => {
  const {
    cardItems,
    timerItem,
    __elementRoot: elementRoot,
    __defaultElements,
  } = game;

  const { elementGameDesc } = __defaultElements;
  // !elementRoot.firstChild

  //
  const elementDurationTime = newElementDurationTime(game);
  timerItem.element = elementDurationTime;
  // Create Card Elements
  const elementCardItems = document.createElement(`div`);
  elementCardItems.className += ` ${CLASS_CARD_ITEMS}`;

  for (const cardRow of cardItems) {
    const elementCardRow = document.createElement(`div`);
    elementCardRow.className += ` ${CLASS_CARD_ROW}`;
    for (const cardItem of cardRow) {
      const elementCard = newElementCardAndSetClickHandle(cardItem, game);
      elementCardRow.appendChild(elementCard);
    }
    elementCardItems.appendChild(elementCardRow);
  }

  elementRoot.appendChild(elementDurationTime);
  elementRoot.appendChild(elementCardItems);
  elementRoot.appendChild(elementGameDesc);

  startTimer(game);
};
const main = (boardSide, elementRoot, timeSettings) => {
  // Initialize Game
  const [cardGridValues, cardsCount] = newCardGrid(boardSide);
  const game = {
    cardItems: cardGridValues.map((row) => {
      return row.map((value) => {
        return { value, faceUp: false, element: null };
      });
    }),
    timerItem: { value: null, element: null },
    state: {
      isPause: false,
      isStop: false,
      activeCardItemsFlipped: [],
      unMatchedCardsCount: cardsCount,
    },
    __startCardCount: cardsCount,
    __elementRoot: elementRoot,
    __timeSettings: timeSettings,
    __defaultElements: {
      elementGameDesc: newElementGameDesc(timeSettings.pause),
    },
  };
  // Start Game

  commencePreGame(game);
};

const elementRoot = document.createElement(`div`);
elementRoot.className += ` ${CLASS_ROOT}`;

document.body.appendChild(elementRoot);
main(BOARD_SIDE_DEFAULT, elementRoot, TIME_DEFAULT_SETTINGS);
