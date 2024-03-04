// import logo from './logo.svg';
import './App.css';

import React, {useState} from 'react';
import { createDeck, calculateScore, checkGameStatus } from './components/gameLogic.js';
const lodashClonedeep = require("lodash.clonedeep");

function App() {
  const [deck, setDeck] = useState(createDeck());
  // const [playerState, setPlayerState] = useState(initialPlayerState);
  const [playerHand, setPlayerHand] = useState([]);
  const [dealerHand, setDealerHand] = useState([]);
  const [gameStatus, setGameStatus] = useState('');

  const initialPlayerState = {
    hands: [[]], // array of player's hands, initially one empty hand
    balance: 1000, // starting balance
    bet: 0, // current bet
  };

  const [playerState, setPlayerState] = useState(initialPlayerState);

  const dealCards = () => {
    const newDeck = [...lodashClonedeep(deck)];
    const playerCards = [newDeck.pop(), newDeck.pop()];
    const dealerCards = [newDeck.pop(), newDeck.pop()];
    setDeck(newDeck);
    setPlayerHand(playerCards);
    setDealerHand(dealerCards);
    setGameStatus('');
  };

  const playerHits = () => {
    if (gameStatus) return;
    const newDeck = [...lodashClonedeep(deck)];
    const newCard = newDeck.pop();
    const newPlayerHand = [...playerHand, newCard];
    setDeck(newDeck);
    setPlayerHand(newPlayerHand);
    const playerScore = calculateScore(newPlayerHand);
    if (playerScore >= 21) {
      return endGame();
    }
  };

  // const splitHand = (playerIndex, handIndex) => {
  //   const player = players[playerIndex];
  //   const hand = player.hands[handIndex];

  //   if (hand.length === 2 && hand[0].value === hand[1].value && player.balance >= player.bet) {
  //     // Duplicate the hand and adjust balance
  //     player.balance -= player.bet;
  //     const newHands = [...player.hands, [hand.pop()]]; // Removes one card from original hand and starts a new hand
  //     player.hands = newHands;
  //     // Update state as necessary
  //   }
  // }

  // const checkDealer = () => {
  //   if (gameStatus) return;
  //   let dealerScore = calculateScore(dealerHand);
  //   // let playerScore = calculateScore(playerHand)
  //   if (dealerScore === 21) {
  //     endGame();
  //   }
  // }

  const endGame = () => {
    let dealerScore = calculateScore(dealerHand);
    while (dealerScore < 17) {
      const newDeck = [...lodashClonedeep(deck)];
      dealerHand.push(newDeck.pop());
      setDeck(newDeck);
      setDealerHand(dealerHand);
      dealerScore = calculateScore(dealerHand);
    }
    const playerScore = calculateScore(playerHand);
    const status = checkGameStatus(playerScore, dealerScore);
    setGameStatus(status);
  }

  const placeBet = (amount) => {
    if (amount <= playerState.balance) {
      setPlayerState((prevState) => ({
        ...prevState,
        bet: amount,
        balance: prevState.balance - amount,
      }));
    } else {
      console.log("Insufficient balance");
    }
  };

  const increaseBet = (amount) => {
    placeBet(playerState.bet + amount);
  };

  const decreaseBet = (amount) => {
    placeBet(playerState.bet - amount);
  };



  return (
    <div className="App">
      <header className="blackjack-header">
        <h1>BlackJack</h1>
        <div>
        <p>Balance: {playerState.balance}</p>
        <p>Current Bet: {playerState.bet}</p>
        <button onClick={() => increaseBet(10)}>+10</button>
        <button onClick={() => increaseBet(50)}>+50</button>
        <button onClick={() => decreaseBet(10)}>-10</button>
        <button onClick={() => decreaseBet(50)}>-50</button>
        <button onClick={() => placeBet(100)}>Bet 100</button>
        <button onClick={() => placeBet(500)}>Bet 500</button>
        </div>
        <button onClick={dealCards}>Deal</button>
        <button onClick={playerHits}>Hit</button>
        <button onClick={endGame}>Stand</button>
        {/* <button onClick={splitHand}>Split</button> */}
        <div>
          <h2>Dealer</h2>
          {dealerHand.map((card,index) => (
            <div key ={index}>{`${card.value} of ${card.suit}`} </div>
          ))}
          <p>Score: {calculateScore(dealerHand)}</p>
        </div>
        <div>
          <h2>Player</h2>
          {playerHand.map((card,index) => (
            <div key ={index}>{`${card.value} of ${card.suit}`} </div>
          ))}
          <p>Score: {calculateScore(playerHand)}</p>
        </div>
        {gameStatus && <p>{gameStatus}</p>}
      </header>
    </div>

  );
}

export default App;
