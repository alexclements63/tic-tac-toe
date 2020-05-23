//Defines blank board
let board = [
  ['', '', ''],
  ['', '', ''],
  ['', '', '']
];

//Defines the two player options
let players = ['X', 'O'];

let currentPlayer;
let available = [];

//Sets up visual aspect and settings for js
function setup() {
  createCanvas(400, 400);
  frameRate(30);
  currentPlayer = floor(random(players.length));
  for (let j = 0; j < 3; j++) {
    for (let i = 0; i < 3; i++) {
      available.push([i, j]);   //Every pair for the grid becomes available
    }
  }
}

//Function that is called within the checkWinner function to determine if the given spots on the board are equal
function equals3(a, b, c) {
  return a == b && b == c && a != '';
}

//Function that checks to see if either side has won the game
function checkWinner() {
  let winner = null;

  //Checks the horizontal win scenarios
  for (let i = 0; i < 3; i++) {
    if (equals3(board[i][0], board[i][1], board[i][2])) {
      winner = board[i][0];
    }
  }

  //Checks the vertical win scenarios
  for (let i = 0; i < 3; i++) {
    if (equals3(board[0][i], board[1][i], board[2][i])) {
      winner = board[0][i];
    }
  }

  //Checks the diagonal win scenarios
  if (equals3(board[0][0], board[1][1], board[2][2])) {
    winner = board[0][0];
  }
  if (equals3(board[2][0], board[1][1], board[0][2])) {
    winner = board[2][0];
  }

  //Checks for a tie scenario
  if (winner == null && available.length == 0) {
    return 'tie';
  } else {
    return winner;
  }
}

//Function that does a turn for the AI
function nextTurn() {
  let index = floor(random(available.length));
  let spot = available.splice(index, 1)[0];
  let i = spot[0];
  let j = spot[1];
  board[i][j] = players[currentPlayer];
  currentPlayer = (currentPlayer + 1) % players.length;
}

//Function that displays the board on the screen
function draw() {
  background(255);
  let w = width / 3;
  let h = height / 3;
  strokeWeight(4);

  line(w, 0, w, height);
  line(w * 2, 0, w * 2, height);
  line(0, h, width, h);
  line(0, h * 2, width, h * 2);

  for (let j = 0; j < 3; j++) {
    for (let i = 0; i < 3; i++) {
      let x = w * i + w / 2;
      let y = h * j + h / 2;
      let spot = board[i][j];
      textSize(32);
      let r = w / 4;
      if (spot == players[1]) {
        noFill();
        ellipse(x, y, r * 2);
      } else if (spot == players[0]) {
        line(x - r, y - r, x + r, y + r);
        line(x + r, y - r, x - r, y + r);
      }
    }
  }

  //Checks and runs the functions to check for an outcome
  let result = checkWinner();
  if (result != null) {
    noLoop();
    let resultP = createP('');
    resultP.style('font-size', '32pt');
    if (result == 'tie') {
      resultP.html('Tie!');
    } else {
      resultP.html(`${result} wins!`);
    }
  } else {
    nextTurn();
  }
}
