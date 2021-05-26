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

  countMarkersFor(player, keys) {
    let markers = keys.filter(key => {
      return this.squares[key].getMarker() === player.getMarker();
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
  }

  getMarker() {
    return this.marker;
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
  constructor() {
    this.board = new Board();
    this.human = new Human();
    this.computer = new Computer();
  }

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

  playOnce() {
    this.board.reset();
    this.board.display();

    while (true) {
      this.humanMoves();
      if (this.gameOver()) break;

      this.computerMoves();
      if (this.gameOver()) break;

      this.board.displayWithClear();
    }

    this.board.displayWithClear();
    this.displayResults();
  }

  play() {
    this.displayWelcomeMessage();

    while (true) {
      this.playOnce();
      if (!this.playAgain()) break;
    }

    this.displayGoodbyeMessage();
  }

  displayWelcomeMessage() {
    console.clear();
    console.log('Welcome to Tic Tac Toe!');
    console.log('');
  }

  displayGoodbyeMessage() {
    console.log('Thanks for playing to Tic Tac Toe! Goodbye!');
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

  isWinner(player) {
    return TTTGame.POSSIBLE_WINNING_ROWS.some(row => {
      return this.board.countMarkersFor(player, row) === 3;
    });
  }

  humanMoves() {
    let choice;

    while (true) {
      let validChoices = this.board.unusedSquares();
      const prompt = `Choose a square (${this.joinOr(validChoices)}): `;
      choice = readline.question(prompt);

      if (validChoices.includes(choice)) break;

      console.log('Sorry that is not a valid choice.');
      console.log();
    }
    this.board.markSquareAt(choice, this.human.getMarker());
  }

  computerMoves() {
    let validChoices = this.board.unusedSquares();
    let choice;

    do {
      choice = Math.floor((9 * Math.random()) + 1).toString();
    } while (!validChoices.includes(choice));
    this.board.markSquareAt(choice, this.computer.getMarker());
  }

  gameOver() {
    return this.boardisFull() || this.someoneWon();
  }

  boardisFull() {
    let unusedSquares = this.board.unusedSquares();
    return unusedSquares.length === 0;
  }

  someoneWon() {
    return this.isWinner(this.human) || this.isWinner(this.computer);
  }

  joinOr(array, delimiter = ', ', delimiter2 = 'or') {
    if (array.length === 1) {
      return `${array[0]}`;
    } else if (array.length < 3) {
      return `${array[0]} ${delimiter2} ${array[1]}`;
    }
    return `${array.slice(0, -1).join(delimiter)}${delimiter}${delimiter2} ${array[array.length - 1]}`;
  }

  playAgain() {
    let choice;

    while (true) {
      let validChoices = ['y', 'n'];
      const prompt = `Would you like to play again? (y/n): `;
      choice = readline.question(prompt)[0];

      if (validChoices.includes(choice)) break;

      console.log('Sorry that is not a valid choice.');
      console.log();
    }
    console.clear();
    console.log();
    console.log();

    return choice === 'y';
  }
}

let game = new TTTGame();
game.play();