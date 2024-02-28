import logo from './logo.svg';
import './App.css';

import React, {useState} from 'react';
import { createDeck, calculateScore, checkGameStatus } from './components/gameLogic.js';

function App() {
  const [deck, setDeck] = useState(createDeck());
  cosnt [playerHand, setPlayerHand] = useState([]);
  const [dealerHand, setDealerHand] = useState([]);
  const [gameStatus, setGameStatus] = useState('');

  const dealCards = () => {
    const newDeck = [...deck];
    const playerCards = [newDeck.pop(), newDeck.pop()];
    const dealerCards = [newDeck.pop(), newDeck.pop()];
    setDeck(newDeck);
    setPlayerHand(playerCards);
    setDealerHand(dealerCards);
    setGameStatus('');
  };


  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
