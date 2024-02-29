// import logo from './logo.svg';
import './App.css';

import React, {useState} from 'react';
import { createDeck, calculateScore, checkGameStatus } from './components/gameLogic.js';

function App() {
  const [deck, setDeck] = useState(createDeck());
  // const [players, setplayers] = useState([]);
  const [playerHand, setPlayerHand] = useState([]);
  const [dealerHand, setDealerHand] = useState([]);
  const [gameStatus, setGameStatus] = useState('');


  const dealCards = () => {
    // const newDeck = [...deck];
    const newDeck = [...JSON.parse(JSON.stringify(deck))]
    const playerCards = [newDeck.pop(), newDeck.pop()];
    const dealerCards = [newDeck.pop(), newDeck.pop()];
    // let dealerScore = calculateScore(dealerHand);
    setDeck(newDeck);
    setPlayerHand(playerCards);
    setDealerHand(dealerCards);
    setGameStatus('');
    // if (dealerScore === 21) {
    //   endGame();
    // }
  };

  const playerHits = () => {
    if (gameStatus) return;
    // const newDeck = [...deck];
    const newDeck = [...JSON.parse(JSON.stringify(deck))]
    const newCard = newDeck.pop();
    const newPlayerHand = [...playerHand, newCard];
    setDeck(newDeck);
    setPlayerHand(newPlayerHand);
    const playerScore = calculateScore(newPlayerHand);
    if (playerScore >= 21) {
      endGame();
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
  // const dealerBusts = () => {
  //   if (gameStatus) return;
  //   let dealerScore = calculateScore(dealerHand);
  //   while (dealerScore < 17) {
  //     const newDeck = [...deck];
  //     dealerHand.push(newDeck.pop());
  //     setDeck(newDeck);
  //     setDealerHand(dealerHand);
  //     dealerScore = calculateScore(dealerHand);
  //   }
  //   if (dealerScore >= 21) {
  //     endGame();
  //   }
  // }

  const endGame = () => {
    let dealerScore = calculateScore(dealerHand);
    while (dealerScore < 17) {
      // const newDeck = [...deck];
      const newDeck = [...JSON.parse(JSON.stringify(deck))]
      dealerHand.push(newDeck.pop());
      setDeck(newDeck);
      setDealerHand(dealerHand);
      dealerScore = calculateScore(dealerHand);
    }
    // if (dealerScore >= 21) {
    //   endGame();
    // }
    const playerScore = calculateScore(playerHand);
    const status = checkGameStatus(playerScore, dealerScore);
    setGameStatus(status);
  }

  return (
    <div className="App">
      <header className="blackjack-header">
        <h1>BlackJack</h1>
        <button onClick={dealCards}>Deal</button>
        <button onClick={playerHits}>Hit</button>
        {/* <button onClick={dealerBusts && endGame}>Stand</button> */}
        <button onClick={endGame}>Stand</button>
        {/* <button onClick={splitHand}>Split</button> */}
        <div>
          <h2>Player</h2>
          {playerHand.map((card,index) => (
            <div key ={index}>{`${card.value} of ${card.suit}`} </div>
          ))}
          <p>Score: {calculateScore(playerHand)}</p>
        </div>
        <div>
          <h2>Dealer</h2>
          {dealerHand.map((card,index) => (
            <div key ={index}>{`${card.value} of ${card.suit}`} </div>
          ))}
          <p>Score: {calculateScore(dealerHand)}</p>
        </div>
        {gameStatus && <p>{gameStatus}</p>}
      </header>
    </div>

  );
}

export default App;
