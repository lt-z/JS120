const readline = require('readline-sync');
const shuffle = require("shuffle-array");

class Card {
  static SUITS = ['Clubs', 'Diamonds', 'Hearts', 'Spades'];
  static VALUES = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'Jack', 'Queen', 'King', 'Ace'];

  constructor(suit, value) {
    this.suit = suit;
    this.value = value;
  }

  isJack() {
    return this.value === 'Jack';
  }

  isQueen() {
    return this.value === 'Queen';
  }

  isKing() {
    return this.value === 'King';
  }

  isAce() {
    return this.value === 'Ace';
  }

  isFaceCard() {
    return this.isJack() || this.isQueen() || this.isKing();
  }

  toSuit() {
    return `${this.value} of ${this.suit}`;
  }

  getValue() {
    if (this.isAce()) {
      return 11;
    } else if (this.isFaceCard()) {
      return 10;
    } else {
      return Number(this.value);
    }
  }
}

class Deck {
  constructor() {
    this.deck = [];
    Card.SUITS.forEach(suit => {
      Card.VALUES.forEach(value => {
        this.deck.push(new Card(suit, value));
      });
    });
    this.shuffle();
  }

  shuffle() {
    shuffle(this.deck);
  }

  getDeck() {
    return this.deck;
  }

  reset() {
    this.deck = [];
    Card.SUITS.forEach(suit => {
      Card.VALUES.forEach(value => {
        this.deck.push(new Card(suit, value));
      });
    });
    this.shuffle();
  }
}

class Player {
  static POOR_THRESHOLD = 0;
  static RICH_THRESHOLD = 10;
  static INITIAL_MONEY = 5;

  constructor() {
    this.hand = [];
    this.money = Player.INITIAL_MONEY;
  }

  displaySuit(hand = this.hand) {
    return hand.map(card => {
      return card.toSuit();
    });
  }

  displayHand(hidden = false) {
    let hand = hidden ? this.displaySuit(this.hideCard()) : this.displaySuit();

    hand.forEach(card => {
      console.log(`   ${card}`);
    });
  }

  hideCard() {
    return [this.hand[0]];
  }

  reset() {
    this.hand = [];
  }

  stay() {
    let answer;

    while (true) {
      console.log('(h)it or (s)tay?');
      answer = readline.question().toLowerCase();
      if (['stay', 's', 'hit', 'h'].includes(answer)) break;
    }
    return ['s', 'stay'].includes(answer);
  }

  getMoney() {
    return this.money;
  }

  decreaseMoney() {
    this.money -= 1;
  }

  increaseMoney() {
    this.money += 1;
  }

  isPoor() {
    return this.money <= Player.POOR_THRESHOLD;
  }

  isRich() {
    return this.money >= Player.RICH_THRESHOLD;
  }
}

class TwentyOneGame {
  static WIN_VALUE_LIMIT = 21;
  static DEALER_VALUE_LIMIT = 17;

  constructor() {
    this.player = new Player();
    this.dealer = new Player();
    this.deck = new Deck();
  }

  start() {
    console.clear();
    this.displayWelcomeMessage();
    while (true) {
      this.startRound();
      if (this.isWinnerOrLoser()) {
        this.displayWinLoss();
        break;
      }
      if (!this.playAgain()) break;
    }
    this.displayGoodbyeMessage();
  }

  startRound() {
    this.dealCards();
    this.displayCards(true);
    this.displayMoney();
    this.playerTurn();
    if (!this.isBusted(this.player)) {
      this.dealerTurn();
    }
    this.displayRoundWinner();
    this.updateMoney();
    this.reset();
  }

  dealCards() {
    this.player.hand = this.deal();
    this.dealer.hand = this.deal();
  }

  deal() {
    let hand = [];
    for (let card = 0; card < 2; card += 1) {
      hand.push(this.deck.getDeck()
        .splice(Math.floor(Math.random() * this.deck.length), 1)[0]);
    }
    return hand;
  }

  hit() {
    return this.deck.getDeck()
      .splice(Math.floor(Math.random() * this.deck.length), 1)[0];
  }

  updateMoney() {
    switch (this.determineWinner()) {
      case this.player:
        this.player.increaseMoney();
        break;
      case this.dealer:
        this.player.decreaseMoney();
        break;
      default: break;
    }
  }

  displayCards(hidden = false) {
    console.log(`Dealer's hand:`);
    this.dealer.displayHand(hidden);
    console.log(`Dealer's hand value: ${this.calculateValue(this.dealer, hidden)}`);
    console.log();
    console.log(`Your hand:`);
    this.player.displayHand();
    console.log(`Your hand value: ${this.calculateValue(this.player)}`);
    console.log();
  }

  playerTurn() {
    while (true) {
      if (this.player.stay()) break;
      this.player.hand.push(this.hit());
      console.clear();
      this.displayCards(true);
      if (this.isBusted(this.player)) break;
    }
  }

  dealerTurn() {
    while (true) {
      this.dealerContinue();
      console.clear();
      if (this.calculateValue(this.dealer) < TwentyOneGame.DEALER_VALUE_LIMIT) {
        console.log('>> Dealer hits <<');
        this.dealer.hand.push(this.hit());
        this.displayCards();
        if (this.isBusted(this.dealer)) break;
      } else {
        console.log('>> Dealer stays <<');
        this.displayCards();
        break;
      }
    }
  }

  dealerContinue() {
    readline.question('Press return key to continue');
  }

  displayWelcomeMessage() {
    console.log('Welcome to Twenty-One!');
    console.log('----------------------');
  }

  displayGoodbyeMessage() {
    console.log('Thank you for playing!');
  }

  displayMoney() {
    console.log(`You have $${this.player.getMoney()}.\n`);
  }

  displayRoundWinner() {
    if (this.isBusted(this.player)) {
      console.log("You busted! Dealer wins.");
    } else if (this.isBusted(this.dealer)) {
      console.log("Dealer busted! You win.");
    } else {
      let playerScore = this.calculateValue(this.player);
      let dealerScore = this.calculateValue(this.dealer);

      if (playerScore > dealerScore) {
        console.log("You win!");
      } else if (playerScore < dealerScore) {
        console.log("Dealer wins!");
      } else {
        console.log('It is a tie.');
      }
    }
  }

  determineWinner() {
    if (this.isBusted(this.player)) {
      return this.dealer;
    } else if (this.isBusted(this.dealer)) {
      return this.player;
    } else {
      let playerScore = this.calculateValue(this.player);
      let dealerScore = this.calculateValue(this.dealer);

      if (playerScore > dealerScore) {
        return this.player;
      } else if (playerScore < dealerScore) {
        return this.dealer;
      } else {
        return null;
      }
    }
  }

  isWinnerOrLoser() {
    return this.player.isPoor() || this.player.isRich();
  }

  displayWinLoss() {
    if (this.player.isPoor()) {
      console.log('You ran out of money! You lose. :(');
    } else if (this.player.isRich()) {
      console.log("You won! You're too rich to play at this table now.");
    }
  }

  valueOfHand(player) {
    return player.hand.map(card => card.getValue());
  }

  calculateValue(player, hidden = false) {
    let hand = player.hand;
    let handValue = hidden ?
      [this.valueOfHand(player)[0]] : this.valueOfHand(player);

    let total = handValue.reduce((sum, val) => sum + val, 0);

    hand.filter(card => card.isAce()).forEach(_ => {
      if (total > TwentyOneGame.WIN_VALUE_LIMIT) {
        total -= 10;
      }
    });

    return total;
  }

  isBusted(player) {
    return this.calculateValue(player) > TwentyOneGame.WIN_VALUE_LIMIT;
  }

  playAgain() {
    let choice;

    while (true) {
      console.log('');
      let validChoices = ['y', 'n'];
      const prompt = `Would you like to play again? (y/n): `;
      choice = readline.question(prompt).toLowerCase();

      if (validChoices.includes(choice)) break;

      console.log('Sorry that is not a valid choice.');
      console.log('');
    }
    console.clear();
    return choice === 'y';
  }

  reset() {
    this.player.reset();
    this.dealer.reset();
    this.deck.reset();
  }
}

let game = new TwentyOneGame();
game.start();