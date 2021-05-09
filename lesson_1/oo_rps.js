/* eslint-disable max-statements */
/* eslint-disable max-lines-per-function */

const readline = require('readline-sync');

function rules() {
  return {
    winningScore: 5,
    winningCombos: {
      rock : ['scissors', 'lizard'],
      paper : ['rock', 'spock'],
      scissors : ['paper', 'lizard'],
      lizard : ['paper', 'spock'],
      spock : ['rock', 'scissors']
    }
  };
}

function createPlayer() {
  return {
    currentMove: null,
    previousMoves: [],
    score: 0,

    updatePreviousMoves() {
      this.previousMoves.push(this.currentMove);
    }
  };
}

function createHuman() {
  let playerObject = createPlayer();

  let humanObject = {
    choose(rules) {
      let choice;

      while (true) {
        console.log('Please choose rock, paper, scissors, lizard, spock');
        choice = readline.question().toLowerCase();
        if (Object.keys(rules.winningCombos).includes(choice)) break;
        console.log('Sorry, invalid choice');
      }
      this.currentMove = choice;
    }
  };
  return Object.assign(playerObject, humanObject);
}

function createComputer() {
  const winThreshold = 0.60;
  const lossThreshold = 0.40;
  const changeWeight = 25;
  let playerObject = createPlayer();

  let computerObject = {
    winLoss: {rock: [0, 0],
      paper: [0, 0],
      scissors: [0, 0],
      lizard: [0, 0],
      spock: [0, 0]},
    winRate: [0.5, 0.5, 0.5, 0.5, 0.5],
    weights: [100, 100, 100, 100, 100],

    choose(rules) {
      let total = this.weights.reduce((sum, num) => sum + num);
      let weightedRandom = Math.floor(Math.random() * total);

      total = 0;
      for (let idx = 0; idx < this.weights.length; idx += 1) {
        total += this.weights[idx];
        if (total >= weightedRandom) {
          this.currentMove = Object.keys(rules.winningCombos)[idx];
          break;
        }
      }
    },

    updateWeight(roundWinner) {
      if (roundWinner !== 'tie') {
        let moveIndex = Object.keys(this.winLoss).indexOf(this.currentMove);
        let sum = this.winLoss[this.currentMove]
          .reduce((acc, num) => acc + num);
        this.winRate[moveIndex] = this.winLoss[this.currentMove][0] / sum;

        if (this.winRate[moveIndex] > winThreshold && roundWinner === 'computer') {
          this.weights[moveIndex] += changeWeight;
        } else if (this.winRate[moveIndex] <= lossThreshold && roundWinner === 'human') {
          this.weights[moveIndex] -= changeWeight;
        }
      }
    }
  };

  return Object.assign(playerObject, computerObject);
}

const RPSGame = {
  human: createHuman(),
  computer: createComputer(),
  rules: rules(),
  roundWinner: null,


  resetGame() {
    this.human.score = 0;
    this.human.previousMoves = [];
    this.computer.score = 0;
    this.computer.previousMoves = [];
    this.computer.winLoss = {
      rock: [0, 0],
      paper: [0, 0],
      scissors: [0, 0],
      lizard: [0, 0],
      spock: [0, 0]};
    this.computer.winRate = [0.5, 0.5, 0.5, 0.5, 0.5];
    this.computer.weights = [100, 100, 100, 100, 100];
  },

  updateMoves() {
    this.human.updatePreviousMoves();
    this.computer.updatePreviousMoves();
  },

  displayPreviousMoves() {
    let humanPrev = this.human.previousMoves;
    let compPrev = this.computer.previousMoves;

    console.log('\nYou       Computer');
    console.log('------------------');
    for (let idx = 0; idx < humanPrev.length; idx += 1) {
      console.log(`${humanPrev[idx].padEnd(8, ' ')}  ${compPrev[idx]}`);
    }
  },

  previousMovePrompt() {
    console.log('\nWould you like to see all of your moves? (y/n)');
    let answer = readline.question().toLowerCase();
    while (answer !== 'y' && answer !== 'n') {
      console.log("Please select either 'y' or 'n'");
      answer = readline.question().toLowerCase();
    }
    return answer === 'y';
  },

  displayWelcomeMessage() {
    console.log('Welcome to Rock, Paper, Scissors, Lizard, Spock!');
    console.log(`First to ${this.rules.winningScore} points wins!`);
    console.log('---------------------------------');
  },

  displayGoodbyeMessage() {
    console.log('Thanks for playing Rock, Paper, Scissors, Lizard, Spock!');
  },

  determineRoundWinner() {
    let humanMove = this.human.currentMove;
    let computerMove = this.computer.currentMove;

    if (this.rules.winningCombos[humanMove].includes(computerMove)) {
      this.human.score += 1;
      this.computer.winLoss[this.computer.currentMove][1] += 1;
      this.roundWinner = 'human';
    } else if (this.rules.winningCombos[computerMove].includes(humanMove)) {
      this.computer.score += 1;
      this.computer.winLoss[this.computer.currentMove][0] += 1;
      this.roundWinner = 'computer';
    } else {
      this.roundWinner = 'tie';
    }
  },

  displayRoundWinner() {
    console.log(`\nYou chose: ${this.human.currentMove}`);
    console.log(`The computer chose: ${this.computer.currentMove}`);

    if (this.roundWinner === 'human') {
      console.log('You win!');
    } else if (this.roundWinner === 'computer') {
      console.log('Computer wins!');
    } else {
      console.log("It's a tie");
    }
    console.log(`Score: You - ${this.human.score}, Computer - ${this.computer.score}\n`);
  },

  displayGameWinner() {
    console.log('=======================');
    console.log(`${this.human.score > this.computer.score ? 'You win' : 'Computer wins'} the game!`);
    console.log('=======================\n');
  },

  playAgain() {
    console.log('\nWould you like to play again? (y/n)');
    let answer = readline.question().toLowerCase();
    while (answer !== 'y' && answer !== 'n') {
      console.log("Please select either 'y' or 'n'");
      answer = readline.question().toLowerCase();
    }
    return answer === 'y';
  },

  play() {
    while (true) {
      console.clear();
      let totalScore = 0;

      this.displayWelcomeMessage();
      while (totalScore < this.rules.winningScore) {
        this.human.choose(this.rules);
        this.computer.choose(this.rules);
        this.updateMoves();
        this.determineRoundWinner();
        this.displayRoundWinner();
        this.computer.updateWeight(this.roundWinner);
        totalScore = Math.max(this.human.score, this.computer.score);
      }
      this.displayGameWinner();

      if (this.previousMovePrompt()) {
        this.displayPreviousMoves();
      }

      if (!this.playAgain()) break;
      this.resetGame();
    }
    this.displayGoodbyeMessage();
  },
};

RPSGame.play();
