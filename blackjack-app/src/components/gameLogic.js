// Creates the deck(s)
export function createDeck() {
    const suits = ['♦','♣','♥','♠'];
    const cardValues = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'Jack', 'Queen', 'King', 'Ace'];
    let deck = [];
    for (let suit of suits) {
      for (let value of cardValues) {
        deck.push({ suit, value });
      }
    }
    return deck
}

// Shuffle the deck
export function shuffleDeck (deck) {
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]]; // Swap
      }
      return deck;
}



// Calculates the score of a hand
export function calculateScore(cards) {
    let score = 0;
    let aceValue = 0;
    for (let card of cards) {
        if (card.value === 'Ace') {
            aceValue += 1;
            score += 11;
        } else if (['Jack', 'Queen', 'King'].includes(card.value)) {
            score += 10;
        } else {
            score += parseInt(card.value);
        }
    }

    // converting ace value from 11 to 1
    while (score > 21 && aceValue > 0) {
        score -= 10;
        aceValue -= 1;
    }

    return score;
}

export function checkGameStatus(playerScore, dealerScore) {
    if (playerScore > 21) return 'Bust! You lose.'
    if (dealerScore > 21) return 'Dealer busts! You win!';
    if (dealerScore === playerScore) return 'Push'
    if (playerScore === 21) return '21! You win!';
    if (dealerScore === 21) return 'Dealer has 21! You lose.';
    if (dealerScore > playerScore && dealerScore <= 21) return 'Dealer wins'
    if (playerScore > dealerScore && playerScore <= 21) return 'You win !'
    return '';
}
