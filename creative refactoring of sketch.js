//Defining variables
let board = [
  ['', '', ''],
  ['', '', ''],
  ['', '', '']
];
let auto = false;
let manual = false;
let winner = null;

//Defines the two player options
let players = ['X', 'O'];

//Defines variables used to fill the board
let currentPlayer;
let available = [];

//Sets up visual aspect and settings for js
function setup() {
  createCanvas(400, 400);
  frameRate(10);
  
  //Creates a checkbox to select each option
  createCheckbox("AI Plays Against You", false).changed(function(){
      auto = this.checked();
  });
  
  createCheckbox("You play", false).changed(function(){
      manual = this.checked();
  });
  
  //Randomly picks between player 1 & 2
  currentPlayer = floor(random(players.length));

  //Makes every pair for the grid available
  for (let j = 0; j < 3; j++) {
    for (let i = 0; i < 3; i++) {
      available.push([i, j]);
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

//Function for where the manual player picks
function mouseClicked() {
    //If the player is clicking off of the board
    if (winner != null || mouseY > width || mouseX > height ) {
        return null;
    }

    //Base variables
    let x = 2;
    let y = 2;

    //Checking where the mouse is being pressed on the vertical (x) axis, then assigning it to a value of a box
    if (((width / 3) - 3) > mouseX) {
        x = 0;
    } else if ((mouseX > ((width / 3) - 3)) && (mouseX <= (width / 3) * 2 - 3)) {
        x = 1;
    }

    //Checking where the mouse is being pressed on the horizontal (y) axis, then assigning it to a value of a box
    if (((height / 3) - 3) > mouseY) {
        y = 0;
    } else if ((mouseY > ((height / 3) - 3)) && (mouseY <= (height / 3) * 2 - 3)) {
        y = 1;
    }

    //Ensures that the spot is not already taken
    if (board[x][y] != "") {
        return;
    }

    //Checks for a winner
    checkWinner();
  
    //Fills the box with the correct player's mark 
    board[x][y] = players[currentPlayer];

    //Sets the spot that was just taken to not be available
    for (let i = 0; i < available.length; i++) {
        if (available[i][0] == x && available[i][1] == y) {
            available.splice(i, 1);
        }
    }

    //Swaps players
    currentPlayer = (currentPlayer + 1) % players.length; 
  
    //Checks for a winner
    checkWinner();
 
    //If the game is set to be against AI, and there is no winner, it plays the AI turn
    if (!manual && winner == null) {
        nextTurn();
        checkWinner();
    }
}


//Function that does a turn for the AI
function nextTurn() {
  let index = floor(random(available.length));
  let spot = available.splice(index, 1)[0];
  let x = spot[0];
  let y = spot[1];
  board[x][y] = players[currentPlayer];
  currentPlayer = (currentPlayer + 1) % players.length;
}


//Function that displays the board on the screen
function draw() {
  background(255,210,122);
  let w = width / 3;
  let h = height / 3;
  strokeWeight(4);

  //Displays grid
  line(w, 0, w, height);
  line(w * 2, 0, w * 2, height);
  line(0, h, width, h);
  line(0, h * 2, width, h * 2);

  //Displays X/O
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
  }
}
