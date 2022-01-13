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

/*        <----- BOARD DIMENSION ----> */

const BOARD_SIDE_DEFAULT = 4;

/*        <----- TIME ----> */

const TIME_DEFAULT_DELAY_PAUSE = 3000;
const TIME_DEFAULT_DELAY_FLASH_ON_MATCHED = 3000;

const MS_PER_SEC = 1000;
const SEC_PER_MIN = 60;
const TIME_DEFAULT_GAME_DURATION = 3 * SEC_PER_MIN * MS_PER_SEC;

const TIME_DEFAULT_TIME_CHECK_INTERVAL = 100;

const TIME_DEFAULT_SETTINGS = {
  delayPause: TIME_DEFAULT_DELAY_PAUSE,
  delayOnMatched: TIME_DEFAULT_DELAY_FLASH_ON_MATCHED,
  gameDuration: TIME_DEFAULT_GAME_DURATION,
  timeCheckInterval: TIME_DEFAULT_TIME_CHECK_INTERVAL,
};

/*        <----- STYLE ----> */

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

/*        <----- PROPERTY CHANGE ----> */

const setBackGroundColor = (element, color) =>
  (element.style.backgroundColor = color);
const setElementBorder = (element, val) => (element.style.border = val);

const setElementInnerText = (element, text) => {
  element.innerHTML = text;
};

const displayStopGame = (game) => {
  const {
    __defaultElements: { elementGameDesc },
  } = game;
  setElementInnerText(elementGameDesc, `Game Ended`);
};

const setTimerElementDurationLeft = (timerItem) => {
  const { element } = timerItem;
  setElementInnerText(element, `${timerItem.value.durationLeft}ms`);
};
/*        <----- ELEMENT: PLAIN ----> */

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

const newElementGameDesc = (freezeTime) => {
  const element = document.createElement(`div`);
  element.innerHTML = `Click two cards, you will have a short viewing time of ${freezeTime}ms if cards are not matching. Game wins when all cards open. glhf!`;
  element.className += ` ${CLASS_GAME_DESC}`;
  return element;
};

/*        <----- ELEMENT: NOT PLAIN ----> */

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

/*        <----- POSITION ----> */

const detachAllChildren = (element) => {
  while (element.lastChild) {
    element.removeChild(element.lastChild);
  }
};

/* <----- Logic Helpers ----> */

/*        <----- STAGE ----> */

const isGameStop = (game) => game.state.isStop;
const stopGame = (game) => {
  console.log(`💎🤲  GAMESTOP 💎🤲 `);
  game.state.isStop = true;
};

const isGamePause = (game) => game.state.isPause;
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

/*        <----- CARD ----> */

const isAllPairsMatch = (game) => game.state.unMatchedCardsCount === 0;
const registerMatchingPair = (game) => (game.state.unMatchedCardsCount -= 2);

const getActiveCardsLength = (game) => game.state.activeCardItemsFlipped.length;

const isMatchingCards = (cardA, cardB) => cardA === cardB;

/*        <----- TIME ----> */

const getDurationLeft = (timerItem) => timerItem.value.endTime - new Date();

const setTimeValueLeft = (timerItem) =>
  (timerItem.value.durationLeft = getDurationLeft(timerItem));

const exceedTime = (timerItem) => timerItem.value.durationLeft < 0;

/* <----- UI-Logic Helpers ----> */

/*        <----- CARD ACTIONS ----> */

const flipDown = (cardItem) => {
  const { element } = cardItem;
  detachAllChildren(element);
  setBackGroundColor(element, ``);
  cardItem.faceUp = false;
};

const flipDownCards = (cardItems) => {
  for (const cardItem of cardItems) {
    flipDown(cardItem);
  }
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

const addActiveCardItem = (game, cardItem) => {
  const { element } = cardItem;
  setElementBorder(element, `1px solid #9acd32`);
  game.state.activeCardItemsFlipped.push(cardItem);
};

const showMatcheeMatchee = (game) => {
  const { __elementRoot: elementParent, __timeSettings: timeSettings } = game;
  const { delayOnMatched } = timeSettings;
  const element = document.createElement(`div`);
  element.className += ` match-hit`;
  element.innerText = `HITTO`;
  console.log(element);

  elementParent.appendChild(element);
  setTimeout(() => {
    elementParent.removeChild(element);
  }, delayOnMatched);
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

/*        <----- GAME PHASE ----> */

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
      console.log(
        `Last matching: ${cardItemA.value.rank}${cardItemA.value.suit}`
      );
      document.getElementById(
        `header`
      ).innerHTML = ` 🔥🚀🔥🚀🔥 ON FIRE 🔥🚀🔥🚀🔥 `; // !!
      stopGameAndDisplayStopGame(game);
    } else {
      console.log(`showing flash hit on ${cardItemA.value.rank}`);
      showMatcheeMatchee(game);
    }
  } else {
    console.log(`Not Matching!`);
    pauseGame(game);
    setTimeout(() => {
      unPauseGame(game);
      flipDownCards(activeCardItemsFlipped);
      deactiveActiveCardItems(game);
    }, timeSettings.delayPause);
  }

  console.groupEnd();
};

const stopGameAndDisplayStopGame = (game) => {
  const { timerItem } = game;
  // !!timerItem
  const { gameDurationCountDownInterval } = timerItem;
  // !!gameDurationCountDownInterval
  clearInterval(gameDurationCountDownInterval);

  stopGame(game);
  displayStopGame(game);
};

const setTimeValueLeftAndUpdateDisplay = (timerItem) => {
  // Set time left
  setTimeValueLeft(timerItem);
  // Displau time left
  setTimerElementDurationLeft(timerItem);
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

  const onClickStartHandler = () => {
    clearGameDisplay(game);
    startGame(game);
  };
  elementStartGameButton.addEventListener(`click`, onClickStartHandler);
};

const startTimer = (game) => {
  const { timerItem, __timeSettings: timeSettings } = game;
  const { gameDuration, timeCheckInterval } = timeSettings;

  const endTime = new Date();
  endTime.setMilliseconds(endTime.getMilliseconds() + gameDuration);
  timerItem.value = { endTime: endTime, durationLeft: null };

  setTimeValueLeftAndUpdateDisplay(timerItem);

  timerItem.gameDurationCountDownInterval = setInterval(() => {
    console.log(`timer started`);
    setTimeValueLeftAndUpdateDisplay(timerItem);

    if (exceedTime(timerItem)) {
      stopGameAndDisplayStopGame(game);
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

const newGame = (gameConfig) => {
  const { boardSide, timeSettings, elementRoot } = gameConfig;
  // Get a grid of cards
  const [cardsIn2DArray, totalCardsCount] = newCardGrid(boardSide);
  const game = {
    // cardItems. Grid of cards has additional associated properties during the game
    cardItems: cardsIn2DArray.map((row) => {
      return row.map((value) => {
        return { value, faceUp: false, element: null };
      });
    }),
    // Timer
    timerItem: {
      value: { endTime: undefined, durationLeft: undefined },
      element: null,
      gameDurationCountDownInterval: null,
    },
    // Game state
    state: {
      isPause: false,
      isStop: false,
      activeCardItemsFlipped: [], // Cards which are open temporarily.
      unMatchedCardsCount: totalCardsCount,
    },
    // variables prefixed with __ should not change during game.
    __startCardCount: totalCardsCount,
    __elementRoot: elementRoot,
    __timeSettings: timeSettings,
    __defaultElements: {
      elementGameDesc: newElementGameDesc(timeSettings.delayPause),
    },
    _gameData: gameConfig,
  };

  return game;
};

const main = (gameData) => {
  // Initialize Game
  const game = newGame(gameData);
  // Commence
  commencePreGame(game);
};

const elementRoot = document.createElement(`div`);
elementRoot.className += ` ${CLASS_ROOT}`;
document.body.appendChild(elementRoot);

const gameConfig = {
  elementRoot: elementRoot,
  boardSide: BOARD_SIDE_DEFAULT,
  timeSettings: TIME_DEFAULT_SETTINGS,
};
// <!--  START  -->
// Flow: main -> commencePreGame -> onClickStartHandler:startGame -> (exceedTime OR isAllPairsMatch): stopGameAndDisplayStopGame
main(gameConfig);
