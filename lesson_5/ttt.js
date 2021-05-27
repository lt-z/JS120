let readline = require("readline-sync");

class Square {
  static UNUSED_SQUARE = ' ';
  static HUMAN_MARKER = 'X';
  static COMPUTER_MARKER = 'O';

  constructor(marker = Square.UNUSED_SQUARE) {
    this.marker = marker;
  }

  toString() {
    return this.marker;
  }

  getMarker() {
    return this.marker;
  }

  setMarker(marker) {
    this.marker = marker;
  }

  isUnused() {
    return this.marker === Square.UNUSED_SQUARE;
  }
}

class Board {
  constructor() {
    this.squares = {};
    for (let counter = 1; counter <= 9; counter += 1) {
      this.squares[String(counter)] = new Square();
    }
  }

  display() {
    console.log("");
    console.log("     |     |");
    console.log(`  ${this.squares[1].getMarker()}  |  ${this.squares[2].getMarker()}  |  ${this.squares[3].getMarker()}`);
    console.log("     |     |");
    console.log("-----+-----+-----");
    console.log("     |     |");
    console.log(`  ${this.squares[4].getMarker()}  |  ${this.squares[5].getMarker()}  |  ${this.squares[6].getMarker()}`);
    console.log("     |     |");
    console.log("-----+-----+-----");
    console.log("     |     |");
    console.log(`  ${this.squares[7].getMarker()}  |  ${this.squares[8].getMarker()}  |  ${this.squares[9].getMarker()}`);
    console.log("     |     |");
    console.log("");
  }

  markSquareAt(key, marker) {
    this.squares[key].setMarker(marker);
  }

  unusedSquares() {
    let keys = Object.keys(this.squares);
    return keys.filter(key => this.squares[key].isUnused());
  }

  isUnusedSquare(key) {
    return this.squares[key].isUnused();
  }

  countMarkersFor(player, keys) {
    let markers = keys.filter(key => {
      return this.squares[key].getMarker() === player.getMarker();
    });
    return markers.length;
  }

  countEmptyMarkers(keys) {
    let markers = keys.filter(key => {
      return this.squares[key].getMarker() === Square.UNUSED_SQUARE;
    });
    return markers.length;
  }

  displayWithClear() {
    console.clear();
    console.log('');
    console.log('');
    this.display();
  }

  reset() {
    this.squares = {};
    for (let counter = 1; counter <= 9; counter += 1) {
      this.squares[String(counter)] = new Square();
    }
  }
}

class Player {
  constructor(marker) {
    this.marker = marker;
    this.score = 0;
  }

  getMarker() {
    return this.marker;
  }

  getScore() {
    return this.score;
  }

  updateScore() {
    this.score += 1;
  }
}

class Human extends Player {
  constructor() {
    super(Square.HUMAN_MARKER);
  }
}

class Computer extends Player {
  constructor() {
    super(Square.COMPUTER_MARKER);
  }
}

class TTTGame {
  static WINS_REQUIRED = 3;
  static POSSIBLE_WINNING_ROWS = [
    [ "1", "2", "3" ],            // top row of board
    [ "4", "5", "6" ],            // center row of board
    [ "7", "8", "9" ],            // bottom row of board
    [ "1", "4", "7" ],            // left column of board
    [ "2", "5", "8" ],            // middle column of board
    [ "3", "6", "9" ],            // right column of board
    [ "1", "5", "9" ],            // diagonal: top-left to bottom-right
    [ "3", "5", "7" ],            // diagonal: bottom-left to top-right
  ];

  constructor() {
    this.board = new Board();
    this.human = new Human();
    this.computer = new Computer();
    this.firstPlayer = this.human;
  }

  playMatch() {
    this.board.reset();
    this.displayScore();
    this.board.display();

    let currentPlayer = this.firstPlayer;
    while (true) {
      this.playerMoves(currentPlayer);
      if (this.gameOver()) break;

      this.displayScore();
      this.board.display();
      currentPlayer = this.togglePlayer(currentPlayer);
    }
    this.updateMatchScore();

    this.board.displayWithClear();
    this.displayResults();
  }

  play() {
    this.displayWelcomeMessage();

    while (true) {
      this.playMatch();
      if (this.matchOver()) break;
      if (!this.playAgain()) break;
      this.firstPlayer = this.togglePlayer(this.firstPlayer);
    }

    this.determineGameWinner();
    this.displayGoodbyeMessage();
  }

  playAgain() {
    let choice;

    while (true) {
      let validChoices = ['y', 'n'];
      const prompt = `Would you like to play again? (y/n): `;
      choice = readline.question(prompt)[0];

      if (validChoices.includes(choice)) break;

      console.log('Sorry that is not a valid choice.');
      console.log('');
    }
    console.clear();
    console.log('');
    console.log('');

    return choice === 'y';
  }

  displayWelcomeMessage() {
    console.clear();
    console.log('Welcome to Tic Tac Toe!');
    console.log('');
    console.log(`First player to win ${TTTGame.WINS_REQUIRED} matches is the winner!`);
  }

  displayGoodbyeMessage() {
    console.log('Thanks for playing to Tic Tac Toe! Goodbye!');
  }

  updateMatchScore() {
    if (this.isWinner(this.human)) {
      this.human.updateScore();
    } else if (this.isWinner(this.computer)) {
      this.computer.updateScore();
    }
  }

  displayScore() {
    console.log('');
    console.log('-----Game Score------');
    console.log(`Player: ${this.human.getScore()} Computer: ${this.computer.getScore()}`);
  }

  determineGameWinner() {
    if (this.human.getScore() === TTTGame.WINS_REQUIRED) {
      console.log('Congrats! You won the game!');
    } else if (this.computer.getScore() === TTTGame.WINS_REQUIRED) {
      console.log('The computer won the game!');
    }
  }

  isMatchWinner(player) {
    return player.getScore() >= TTTGame.WINS_REQUIRED;
  }

  matchOver() {
    return this.isMatchWinner(this.human) || this.isMatchWinner(this.computer);
  }

  humanMoves() {
    let choice;

    while (true) {
      let validChoices = this.board.unusedSquares();
      const prompt = `Choose a square (${this.joinOr(validChoices)}): `;
      choice = readline.question(prompt);

      if (validChoices.includes(choice)) break;

      console.log('Sorry that is not a valid choice.');
      console.log('');
    }
    this.board.markSquareAt(choice, this.human.getMarker());
  }

  findAtRiskSquare(player) {
    for (let line = 0; line < TTTGame.POSSIBLE_WINNING_ROWS.length; line += 1) {
      let currentLine = TTTGame.POSSIBLE_WINNING_ROWS[line];

      if (this.board.countMarkersFor(player, currentLine) === 2 &&
       this.board.countEmptyMarkers(currentLine) === 1) {
        let index = currentLine.findIndex(sq => this.board.isUnusedSquare(sq));
        return currentLine[index];
      }
    }
    return null;
  }

  pickMiddleSquare() {
    return (this.board.isUnusedSquare('5')) ? '5' : null;
  }

  computerMoves() {
    let validChoices = this.board.unusedSquares();
    let randomChoice = Math.floor(Math.random() * validChoices.length)
      .toString();

    let choice = this.findAtRiskSquare(this.computer) ||
                  this.findAtRiskSquare(this.human) ||
                  this.pickMiddleSquare() ||
                  validChoices[randomChoice];

    this.board.markSquareAt(choice, this.computer.getMarker());
  }

  playerMoves(player) {
    if (this.human === player) {
      this.humanMoves();
    } else {
      this.computerMoves();
    }
  }

  togglePlayer(player) {
    if (this.human === player) {
      return this.computer;
    } else {
      return this.human;
    }
  }

  boardisFull() {
    let unusedSquares = this.board.unusedSquares();
    return unusedSquares.length === 0;
  }

  gameOver() {
    return this.boardisFull() || this.someoneWon();
  }

  isWinner(player) {
    return TTTGame.POSSIBLE_WINNING_ROWS.some(row => {
      return this.board.countMarkersFor(player, row) === 3;
    });
  }

  someoneWon() {
    return this.isWinner(this.human) || this.isWinner(this.computer);
  }

  displayResults() {
    if (this.isWinner(this.human)) {
      console.log('You won! Congratulations!');
    } else if (this.isWinner(this.computer)) {
      console.log('I won! I won! Take that, human!');
    } else {
      console.log('A tie game. How boring.');
    }
  }

  joinOr(array, delimiter = ', ', delimiter2 = 'or') {
    if (array.length === 1) {
      return `${array[0]}`;
    } else if (array.length < 3) {
      return `${array[0]} ${delimiter2} ${array[1]}`;
    }
    return `${array.join(delimiter).slice(0, -1)}${delimiter2} ${array.slice(-1)}`;
  }
}

let game = new TTTGame();
game.play();