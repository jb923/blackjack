// import logo from './logo.svg';
import './App.css';

import React, { useState, useEffect } from 'react';
import { createDeck, shuffleDeck, calculateScore, checkGameStatus } from './components/gameLogic.js';
// const lodashClonedeep = require("lodash.clonedeep");

function App() {
  const [deck, setDeck] = useState(shuffleDeck(createDeck()));
  const [playerHands, setPlayerHands] = useState([[]]);
  const [dealerHand, setDealerHand] = useState([]);
  const [currentHandIndex, setCurrentHandIndex] = useState(0);
  const [bets, setBets] = useState([10]); // Initial bet for the first hand
  const [balance, setBalance] = useState(1000); // Player's starting balance
  const [gameStatus, setGameStatus] = useState('');
  const [playerTurn, setPlayerTurn] = useState('');
  const [count, setCount] = useState(0);

  useEffect(() => {
    // Deal initial hands
    dealCards();
  }, []); // This empty array means the effect runs once on component mount



  const dealCards = () => {
    let newDeck = shuffleDeck(createDeck());
    const playerHand = [newDeck.pop(), newDeck.pop()];
    const dealerHand = [newDeck.pop(), newDeck.pop()];
    updateCount(newDeck.pop())
    setDeck(newDeck);
    setPlayerHands([playerHand]);
    setDealerHand(dealerHand);
    setCurrentHandIndex(0);
    setBets([10]);
    setGameStatus('');
    setPlayerTurn('player_turn')
  };

  const playerHits = () => {
    if (gameStatus) return;
    const newDeck = [...deck];
    const newCard = newDeck.pop();
    updateCount(newCard);
    const updatedPlayerHands = playerHands.map((hand, index) =>
      index === currentHandIndex ? [...hand, newCard] : hand
    );
    setDeck(newDeck);
    setPlayerHands(updatedPlayerHands);
    const playerScore = calculateScore(updatedPlayerHands);
    if (playerScore > 21) {
      handleStand();
    }
    // need to debug when player busts
  };

  const handleStand = () => {
    if (currentHandIndex < playerHands.length - 1) {
      setCurrentHandIndex(currentHandIndex + 1)
    } else {
        let dealerScore = calculateScore(dealerHand);
        const drawDealerCards = (currentDeck, currentDealerHand) => {
          let updatedDeck = [...currentDeck];
          let updatedDealerHand = [...currentDealerHand];
          let updatedDealerScore = calculateScore(updatedDealerHand);

          while (updatedDealerScore < 17) {
            const newCard = updatedDeck.pop();
            updateCount(newCard);
            updatedDealerHand.push(newCard);
            updatedDealerScore = calculateScore(updatedDealerHand);
          }
          return { updatedDeck, updatedDealerHand };
        };
        const { updatedDeck, updatedDealerHand } = drawDealerCards(deck, dealerHand);
        setDeck(updatedDeck);
        setDealerHand(updatedDealerHand);
        dealerScore = calculateScore(updatedDealerHand);
        const playerScore = calculateScore(playerHands);
        const status = checkGameStatus(playerScore, dealerScore);
        setGameStatus(status);
        checkWinnerAndUpdateBalance();
        setPlayerTurn('dealer_turn')
    }
  };

  const handleSplit = () => {
    if (playerHands[currentHandIndex].length === 2 &&
        playerHands[currentHandIndex][0].value === playerHands[currentHandIndex][1].value &&
        balance >= bets[currentHandIndex]) { // Check if player can afford to split
      let newHands = [...playerHands];
      let handToSplit = newHands.splice(currentHandIndex, 1)[0];
      let card1 = handToSplit[0];
      let card2 = handToSplit[1];
      newHands.splice(currentHandIndex, 0, [card1, deck.pop()], [card2, deck.pop()]);

      let newBets = [...bets];
      newBets.splice(currentHandIndex, 0, bets[currentHandIndex]); // Duplicate bet for the new hand
      setBalance(balance - bets[currentHandIndex]); // Deduct bet for the new hand

      setPlayerHands(newHands);
      setBets(newBets);
    }
  };

  const checkWinnerAndUpdateBalance = () => {
    let dealerScore = calculateScore(dealerHand);
    let totalWinnings = 0; // Initialize total winnings

    playerHands.forEach((hand, index) => {
      const playerScore = calculateScore(hand);
      let bet = bets[index];
      if ((playerScore > dealerScore && playerScore <= 21) || dealerScore > 21) {
        // Player wins
        totalWinnings += bet * 2; // Player wins double their bet
      } else if (playerScore === dealerScore) {
        // Push - player gets their bet back but doesn't win additional money
        totalWinnings += bet;
      } // No else needed for losses as totalWinnings remains unchanged
    });

    // Update player balance with the total winnings
    setBalance((prevBalance) => prevBalance + totalWinnings - calculateTotalBets());
  };

  const calculateTotalBets = () => {
    return bets.reduce((total, bet) => total + bet, 0);
  };

  const handleDoubleDown = () => {
    if (playerHands[currentHandIndex].length === 2 && balance >= bets[currentHandIndex]) {
      let newDeck = [...deck];
      const newCard = newDeck.pop();
      updateCount(newCard)
      const updatedHands = playerHands.map((hand, index) =>
        index === currentHandIndex ? [...hand, newCard] : hand
      );
      setDeck(newDeck);
      setPlayerHands(updatedHands);

      // Double the bet
      let newBets = [...bets];
      newBets[currentHandIndex] *= 2;
      setBets(newBets);

      // Deduct the additional bet from balance
      setBalance((prevBalance) => prevBalance - bets[currentHandIndex]);
      handleStand();

      // **** need to check/debug if the bets for double down actually calculate ****
    }
  };

  // ***  need to create a function that is hidden to find the running count ****
  // needs to be placed in all areas where a card is dealt (debug)
  const updateCount = (card) => {
    let value = card.value;
    if (['2', '3', '4', '5', '6'].includes(value)) {
      setCount((prevCount) => prevCount + 1);
    } else if (['10', 'J', 'Q', 'K', 'A'].includes(value)) {
      setCount((prevCount) => prevCount - 1);
    }
  };

  // add the ability to increase the bet again?
  // const increaseBet = (amount) => {
  //   placeBet(playerState.bet + amount);
  // };

  // const decreaseBet = (amount) => {
  //   placeBet(playerState.bet - amount);
  // };

  // add a "new game" feature that reshuffles the deck and resets the player balance?

  return (
    <div className="App">
    <h2>Blackjack Game</h2>
    <div>
      <p>Balance: ${balance}</p>
      <div>Count: {count}</div>
      <p>Dealer's Hand: {dealerHand.map((card, index) => (
        <span key={index}>{index === 0 || playerTurn === 'dealer_turn' ? card.value + ' of ' + card.suit : 'Hidden'}, </span>
      ))}</p>
      <p>Score: {calculateScore(dealerHand)}</p>
      {playerHands.map((hand, index) => (
        <div key={index} style={{ margin: '20px', padding: '20px', border: currentHandIndex === index ? '2px solid green' : '1px solid black' }}>
          <h4>Hand {index + 1}</h4>
          {hand.map((card, cardIndex) => (
            <span key={cardIndex}>{card.value} of {card.suit}{cardIndex < hand.length - 1 ? ', ' : ''}</span>
          ))}
          <div style={{ marginTop: '10px' }}>
            <button onClick={dealCards} disabled={currentHandIndex !== index}>Deal</button>
            <button onClick={playerHits} disabled={currentHandIndex !== index}>Hit</button>
            <button onClick={handleStand} disabled={currentHandIndex !== index}>Stand</button>
            <button onClick={handleDoubleDown} disabled={currentHandIndex !== index}>Double Down</button>
            {hand.length === 2 && hand[0].value === hand[1].value && balance >= bets[index] && (
              <button onClick={handleSplit}>Split</button>
            )}
          </div>
          {/* <p>Score: {calculateScore(...playerHands)}</p> */}
          {/* {gameStatus && <p>{gameStatus}</p>} */}
          <p>Bet: ${bets[index]}</p>
        </div>
      ))}
    </div>
  </div>

  );
}

export default App;
