/* <----- CSS Class Names ----> */

const CLASS_GRID_ITEMS = `match-card-grid`;
const CLASS_CARD_ROW = `match-card-row`;
const CLASS_CARD = `match-card`;
const CLASS_CARD_SUIT = `match-card-suit`;
const CLASS_CARD_NAME = `match-card-name`;

const CLASS_BANNER = `match-banner`;

const CLASS_GAME_DESC = `match-game-desc`;

const CLASS_ROOT = `match-root`;

const CLASS_TIME_BANNER = `match-time-bar`;
const CLASS_WRAPPER_BUTTON_IN_GAMES = `match-wrapper-buttons-in-game`;
const CLASS_BUTTON_START = `match-button-start-game`;
const CLASS_BUTTON_PAUSE = `match-button-pause-game`;
const CLASS_BUTTON_PLAY = `match-button-play-game`;
const CLASS_IMG_BUTTON_IN_GAME = `match-img-button-in-game`;

const CLASS_NAME_WRAPPER = `match-name-wrapper`;
const CLASS_NAME_INPUT = `match-name-input`;
const CLASS_NAME_DISPLAY = `match-name-display`;

/* <----- DEFAULT CONFIG ----> */

/*        <----- PROFILE ----> */

const DEFAULT_PLAYER_NAME = `PLAYER 1`;

/*        <----- BOARD DIMENSION ----> */

const BOARD_SIDE_DEFAULT = 2;

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

/* <----- END OF DEFAULT CONFIG ----> */

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
  element.innerText = text;
};

const displayStopGame = (game) => {
  const {
    __defaultElements: { elementGameDesc },
  } = game;
  setElementInnerText(elementGameDesc, `Game Ended`);
};

const clearGameDisplay = (game) => {
  const { __elementRoot: elementRoot } = game;
  console.log(`detaching`);
  console.log(elementRoot);
  detachAllChildren(elementRoot);
};

const setTimerElementDurationLeft = (timerItem) => {
  const { element } = timerItem;
  setElementInnerText(element, `${timerItem.value.durationLeft}ms`);
};
/*        <----- ELEMENT: PLAIN ----> */

const newDefaultElementHeader = () => {
  const element = document.createElement(`h1`);
  setElementInnerText(element, `SWE101! 🚀 Matchee Mutchee`);
  return element;
};
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
  setElementInnerText(
    element,
    `Click two cards, you will have a short viewing time of ${freezeTime}ms if cards are not matching. Game wins when all cards open. glhf!`
  );
  element.className += ` ${CLASS_GAME_DESC}`;
  return element;
};

const newElementButtonStart = () => {
  const element = document.createElement(`button`);
  const elementButtonStartDesc = document.createTextNode(`Start Game`);
  element.className += ` ${CLASS_BUTTON_START}`;
  element.appendChild(elementButtonStartDesc);

  return element;
};

const newElementNameWrapper = () => {
  const element = document.createElement(`div`);
  const elementButtonStartDesc = document.createTextNode(`Input Your Name :)`);
  element.className += ` ${CLASS_NAME_WRAPPER}`;
  element.appendChild(elementButtonStartDesc);

  return element;
};

const newElementInGameButtonsWrapper = () => {
  const element = document.createElement(`button`);
  element.className += ` ${CLASS_WRAPPER_BUTTON_IN_GAMES}`;

  return element;
};

const newElementButtonPlay = () => {
  const element = document.createElement(`button`);
  element.className += ` ${CLASS_BUTTON_PLAY}`;
  element.innerHTML = ` |>`;
  return element;
};
const newElementButtonPause = () => {
  const element = document.createElement(`button`);
  element.className += ` ${CLASS_BUTTON_PAUSE}`;
  element.innerText = `||`;

  return element;
};

const newElementCardGrid = () => {
  const element = document.createElement(`div`);
  element.className += ` ${CLASS_GRID_ITEMS}`;
  return element;
};

/*        <----- ELEMENT: NOT PLAIN ----> */

const onCardClickHandler = (cardItem, game) => {
  const [is, msg] = isCardClickable(cardItem, game);

  if (is === false) {
    console.warn(msg);
    return;
  }
  flipUp(cardItem);
  addActiveCardItem(game, cardItem);

  const activeCardsLength = getActiveCardsLength(game);
  if (activeCardsLength === 2) {
    settle(game);
  }
};
const newElementCardAndSetClickHandle = (cardItem, game) => {
  const element = document.createElement(`div`);
  element.className += ` ${CLASS_CARD}`;
  element.addEventListener(`click`, () => {
    onCardClickHandler(cardItem, game);
  });
  cardItem.element = element;
  return element;
};

const hideElement = (element) => (element.style.display = `none`);
const hideStartButton = (game) => {
  const { clickables } = game;
  const { startElements } = clickables;
  const { elementButtonStart } = startElements;
  // !!elementButtonStart
  hideElement(elementButtonStart);
};

const showElement = (element) => (element.style.display = `flex`);

const showStartButton = (game) => {
  const { clickables } = game;
  const { startElements } = clickables;
  const { elementButtonStart } = startElements;
  // !!elementButtonStart
  showElement(elementButtonStart);
};

const newElementNameInputAndSetClickHandler = (game) => {
  const {
    nameItem: { value: name },
  } = game;

  const element = document.createElement(`input`);
  element.className += ` ${CLASS_NAME_INPUT}`;
  element.setAttribute(`type`, `text`);

  // Show placeholder name on start screen
  let firstName = name || `-`;
  element.setAttribute(`value`, firstName);
  updateNameValueAndDisplay(game, firstName);

  element.addEventListener(`input`, (event) => {
    const value = event.target.value;
    updateNameValueAndDisplay(game, value);
    if (value === ``) {
      hideStartButton(game);
    } else {
      showStartButton(game);
    }
  });

  return element;
};

const newElementNameDisplay = () => {
  const element = document.createElement(`div`);
  element.className = ` ${CLASS_NAME_DISPLAY}`;
  return element;
};

/*        <----- POSITION ----> */

const detachAllChildren = (element) => {
  while (element.lastChild) {
    element.removeChild(element.lastChild);
  }
};

/* <----- Logic Helpers ----> */

/*                                <----- LH:STATE ----> */

/*                                                        <----- LH:STATE: gamestop ----> */

const isGameStop = (game) => {
  if (game.state.isStop === undefined || game.state.isStop === null) {
    console.warn(`A game must be started before game state can be queried.`);
    return;
  }

  return game.state.isStop;
};

const flagGameStart = (game) => {
  console.log(`  GAMESTART  `);
  game.state.isStop = false;
};

const flagGameStop = (game) => {
  console.log(`💎🤲  GAMESTOP 💎🤲 `);
  if (game.state.isStop === undefined || game.state.isStop === null) {
    console.warn(`A game must be started before game can be stopped.`);
    return;
  }
  game.state.isStop = true;
};

/*                                                        <----- LH:STATE: gamepause ----> */

const isGamePause = (game) => {
  if (game.state.isPause === undefined || game.state.isPause === null) {
    console.warn(
      `A game must be pause/unpaused before game state can be queried.`
    );
    return;
  }
  console.log(`isGamePause ${game.state.isPause}`);
  return game.state.isPause;
};

const flagGamePause = (game) => {
  if (isGameStop(game)) {
    console.warn(`[flagGamePause] behavior not executed. game has stopped`);
    return;
  }
  console.log(`[flagGamePause] set.`);
  game.state.isPause = true;
};

const deflagGamePause = (game) => {
  if (isGameStop(game)) {
    console.warn(`[deflagGamePause] behavior not executed. game has stopped`);
    return;
  }
  game.state.isPause = false;
};

/*                                                        <----- LH:STATE: cardcooldown ----> */
const isCardCoolDowning = (game) => game.state.isCardOnCoolDown;
const flagMissCoolDown = (game) => {
  if (isGameStop(game)) {
    console.warn(`[flagMissCoolDown] behavior not executed. game has stopped`);
    return;
  }
  console.log(`[flagMissCoolDown] isCardOnCoolDown set`);

  game.state.isCardOnCoolDown = true;
};
const deflagMissCoolDown = (game) => {
  if (isGameStop(game)) {
    console.warn(
      `[deflagMissCoolDown] behavior not executed. game has stopped`
    );
    return;
  }
  console.log(`[deflagMissCoolDown] isCardOnCoolDown unset`);
  game.state.isCardOnCoolDown = false;
};

const isCardClickable = (cardItem, game) => {
  const functionName = `isCardClickable`;
  if (cardItem.faceUp) {
    return [false, `[${functionName}] already face up.....`];
  }
  if (isGameStop(game)) {
    return [false, `[${functionName}] Game stopped.`];
  }
  if (isGamePause(game)) {
    return [false, `[${functionName}] Game paused.`];
  }
  if (isCardCoolDowning(game)) {
    return [false, `[${functionName}] Cooling Down.`];
  }
  return [true, ``];
};

/*                                                        <----- LH:CARD ----> */

const isAllPairsMatch = (game) => game.state.unMatchedCardsCount === 0;
const registerMatchingPair = (game) => (game.state.unMatchedCardsCount -= 2);
const getActiveCardsLength = (game) => game.state.activeCardItemsFlipped.length;
const isMatchingCards = (cardA, cardB) => cardA === cardB;

/*                                                        <----- LH:TIME ----> */

const getDurationLeft = (timerItem) => timerItem.value.endTime - new Date();
const setTimerValueLeft = (timerItem) =>
  (timerItem.value.durationLeft = getDurationLeft(timerItem));
const exceedTime = (timerItem) => timerItem.value.durationLeft < 0;

/* <----- UI-Logic Helpers (a mix of ui and logic in the function body) ----> */

/*                                                        <----- UI-LH:STATS / GENERAL INFO ----> */

const updateNameValueAndDisplay = (game, newValue) => {
  const { nameItem } = game;
  const {
    element: { display: elementNameDisplay },
  } = nameItem;

  // update name value
  nameItem.value = newValue;

  // display
  setElementInnerText(elementNameDisplay, newValue);
};

/*                                                        <----- UI-LH:CARD ACTIONS ----> */

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
  const {
    __timeSettings: timeSettings,
    cardGridItems: { element: elementParent },
  } = game;

  const { delayOnMatched } = timeSettings;
  const element = document.createElement(`div`);
  element.className += ` match-hit`;
  element.innerText = `HITTO`;

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

/*                                                        <----- UI-LH:TIME CONTROL ----> */

const updateDisplayTimerControl = (game) => {
  const { clickables } = game;
  const { inGameTimeControlElements } = clickables;
  const {
    wrapper: elementButtonTimeControlWrapper,
    buttonPause: elementButtonPause,
    buttonPlay: elementButtonPlay,
  } = inGameTimeControlElements;

  // !!elementButtonTimeControlWrapper
  const isGamePausing = isGamePause(game);
  if (isGamePausing === true) {
    elementButtonTimeControlWrapper.replaceChildren(elementButtonPlay);
  } else if (isGamePausing === false) {
    elementButtonTimeControlWrapper.replaceChildren(elementButtonPause);
  } else {
    console.warn(
      `[updateTimerControl] isGamePausing undefined or null or not a boolean`
    );
  }
};

const unsetGameCountdownInterval = (game) => {
  const { timerItem } = game;
  const { gameDurationCountDownInterval } = timerItem;
  // !!gameDurationCountDownInterval
  if (!gameDurationCountDownInterval) {
    throw new Error(
      `[unsetGameCoundownInterval] should be called only if there is a countdown interval`
    );
  }
  clearInterval(gameDurationCountDownInterval);
  timerItem.gameDurationCountDownInterval = null;
};

const stopGameAndDisplayStopGame = (game) => {
  unsetGameCountdownInterval(game);
  flagGameStop(game);
  displayStopGame(game);
};

const pauseTimer = (game) => {
  flagGamePause(game);
  updateDisplayTimerControl(game);
  unsetGameCountdownInterval(game);
};

const setTimeDurationLeftAndUpdateDisplay = (timerItem) => {
  // Set time left
  setTimerValueLeft(timerItem);
  // Displau time left
  setTimerElementDurationLeft(timerItem);
};

const goTimer = (game) => {
  const { timerItem, __timeSettings: timeSettings } = game;
  const { timeCheckInterval } = timeSettings;

  if (!isGamePause(game)) {
    console.warn(`[goTimer] Game should be paused for game to go again`);
  }
  if (timerItem.gameDurationCountDownInterval) {
    throw new Error(`[goTimer] Must have one game countdown timer only`);
  }

  deflagGamePause(game);
  updateDisplayTimerControl(game);

  setTimeDurationLeftAndUpdateDisplay(timerItem);

  timerItem.gameDurationCountDownInterval = setInterval(() => {
    setTimeDurationLeftAndUpdateDisplay(timerItem);
    if (exceedTime(timerItem)) {
      stopGameAndDisplayStopGame(game);
    }
  }, timeCheckInterval);
};

const readyTimer = (game) => {
  const { timerItem, __timeSettings: timeSettings } = game;
  const { gameDuration } = timeSettings;
  // Set end time as offset of now
  const endTime = new Date();
  endTime.setMilliseconds(endTime.getMilliseconds() + gameDuration);
  timerItem.value.endTime = endTime;
};

const playTimer = (game) => {
  readyTimer(game);
  goTimer(game);
};

/*        <----- GAME PHASE ----> */

// Reconciliation after every two clicks.
const settle = (game) => {
  console.group(`[settle] Two cards clicked.`);
  const { state, __timeSettings: timeSettings, __defaultElements } = game;
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
      const { elementHeader } = __defaultElements;
      setElementInnerText(elementHeader, ` 🔥🚀🔥🚀🔥 ON FIRE 🔥🚀🔥🚀🔥 `);
      stopGameAndDisplayStopGame(game);
    } else {
      console.log(`Showing flash hit on ${cardItemA.value.rank}`);
      showMatcheeMatchee(game);
    }
  } else {
    console.log(`Not Matching!`);
    flagMissCoolDown(game);
    setTimeout(() => {
      deflagMissCoolDown(game);
      flipDownCards(activeCardItemsFlipped);
      deactiveActiveCardItems(game);
    }, timeSettings.delayPause);
  }

  console.groupEnd();
};

/* <----- DRIVER ----> */

/*                            <----- MAIN PHASE ----> */

const startGame = (game) => {
  const {
    cardGridItems,
    timerItem,
    nameItem: { element: nameElements },
    clickables,
    __elementRoot: elementRoot,
    __defaultElements,
  } = game;

  const { elementGameDesc } = __defaultElements;
  const { display: elementNameDisplay } = nameElements;
  const { inGameTimeControlElements } = clickables;
  const { value: cardGrid } = cardGridItems;

  flagGameStart(game);
  // !elementRoot.firstChild

  // Create Card Elements
  const elementCardGridWrapper = newElementCardGrid();
  cardGridItems.element = elementCardGridWrapper;
  for (const cardRow of cardGrid) {
    const elementCardRow = document.createElement(`div`);
    elementCardRow.className += ` ${CLASS_CARD_ROW}`;
    for (const cardItem of cardRow) {
      const elementCard = newElementCardAndSetClickHandle(cardItem, game);
      elementCardRow.appendChild(elementCard);
    }
    elementCardGridWrapper.appendChild(elementCardRow);
  }

  // Create Time Control Buttons

  const elementTimeBanner = document.createElement(`div`);
  elementTimeBanner.className += ` ${CLASS_TIME_BANNER}`;
  const elementDurationTimeLeft = newElementDurationTime(game);
  timerItem.element = elementDurationTimeLeft;
  elementTimeBanner.appendChild(elementDurationTimeLeft);

  const elementInGameTimeControlWrapper = newElementInGameButtonsWrapper();
  inGameTimeControlElements.wrapper = elementInGameTimeControlWrapper;

  const elementButtonPause = newElementButtonPause();
  inGameTimeControlElements.buttonPause = elementButtonPause;
  elementButtonPause.addEventListener(`click`, () => {
    pauseTimer(game);
  });
  elementInGameTimeControlWrapper.appendChild(elementButtonPause);

  const elementButtonPlay = newElementButtonPlay();
  inGameTimeControlElements.buttonPlay = elementButtonPlay;
  elementButtonPlay.addEventListener(`click`, () => {
    playTimer(game);
  });
  elementInGameTimeControlWrapper.appendChild(elementButtonPlay);
  elementTimeBanner.appendChild(elementInGameTimeControlWrapper);

  // Append to Screen
  elementRoot.appendChild(elementNameDisplay);
  elementRoot.appendChild(elementTimeBanner);
  elementRoot.appendChild(elementCardGridWrapper);
  elementRoot.appendChild(elementGameDesc);

  startTimer(game);
};

const commencePreGame = (game) => {
  const {
    __elementRoot: elementRoot,
    __defaultElements,
    nameItem,
    clickables,
  } = game;
  const { elementGameDesc, elementHeader } = __defaultElements;

  const elementNameWrapper = newElementNameWrapper();
  nameItem.element.wrapper = elementNameWrapper;

  const elementNameDisplay = newElementNameDisplay();
  nameItem.element.display = elementNameDisplay;

  const elementNameInputField = newElementNameInputAndSetClickHandler(game);
  nameItem.element.field = elementNameInputField;

  const elementButtonStart = newElementButtonStart();
  clickables.preCommenceElements.buttonStart = elementButtonStart;

  elementNameWrapper.appendChild(elementNameInputField);
  elementNameWrapper.appendChild(elementNameDisplay);

  elementRoot.appendChild(elementHeader);
  elementRoot.appendChild(elementNameWrapper);
  elementRoot.appendChild(elementButtonStart);
  elementRoot.appendChild(elementGameDesc);

  const onClickStartHandler = () => {
    clearGameDisplay(game);
    startGame(game);
  };
  elementButtonStart.addEventListener(`click`, onClickStartHandler);
};

// Alias
const startTimer = playTimer;

const newGame = (gameConfig) => {
  const { boardSide, timeSettings, elementRoot } = gameConfig;
  // Get a grid of cards
  const [cardsIn2DArray, totalCardsCount] = newCardGrid(boardSide);
  const game = {
    // cardItems. Grid of cards has additional associated properties during the game
    cardGridItems: {
      value: cardsIn2DArray.map((row) => {
        return row.map((value) => {
          return { value, faceUp: false, element: null };
        });
      }),
      element: null,
    },
    // Timer
    timerItem: {
      value: { endTime: undefined, durationLeft: undefined },
      element: null,
      gameDurationCountDownInterval: null,
    },
    nameItem: {
      element: { field: null, display: null, wrapper: null }, // wrapper hugs the field and display elements.
      value: DEFAULT_PLAYER_NAME,
    },
    clickables: {
      preCommenceElements: { buttonStart: null },
      inGameTimeControlElements: {
        wrapper: null,
        buttonPause: null,
        buttonPlay: null,
      },
    },
    // Game state
    state: {
      isCardOnCoolDown: false,
      isPause: undefined,
      isStop: undefined,
      activeCardItemsFlipped: [], // Cards which are open temporarily.
      unMatchedCardsCount: totalCardsCount,
    },
    // variables prefixed with __ should not change during game.
    __startCardCount: totalCardsCount,
    __elementRoot: elementRoot,
    __timeSettings: timeSettings,
    __defaultElements: {
      elementGameDesc: newElementGameDesc(timeSettings.delayPause),
      elementHeader: newDefaultElementHeader(),
    },
    _gameData: gameConfig,
  };

  return game;
};

// <!--  MAIN  -->

const main = (gameData) => {
  // Initialize Game
  const game = newGame(gameData);
  // Commence
  commencePreGame(game);
};

// append elementRoot of game to html body. elementRoot is root-level ancestor for all other game elements.
const elementRoot = document.createElement(`div`);
elementRoot.className += ` ${CLASS_ROOT}`;
document.body.appendChild(elementRoot);

const gameConfig = {
  elementRoot: elementRoot,
  boardSide: BOARD_SIDE_DEFAULT,
  timeSettings: TIME_DEFAULT_SETTINGS,
};
// Flow: main -> commencePreGame -> onClickStartHandler:startGame -> (exceedTime OR isAllPairsMatch): stopGameAndDisplayStopGame
main(gameConfig);
