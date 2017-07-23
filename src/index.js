import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  )
}

class Block extends React.Component {
  renderSquare(i, j) {
    return (
      <Square
        value={this.props.squares[i][j]}
        onClick={() => this.props.onClick(i, j)}
      />
    )
  }

  render() {
    return (
      <div className="board-block">
        <div className="board-row">
          {this.renderSquare(this.props.value.i + 0, this.props.value.j + 0)}
          {this.renderSquare(this.props.value.i + 1, this.props.value.j + 0)}
          {this.renderSquare(this.props.value.i + 2, this.props.value.j + 0)}
        </div>
        <div className="board-row">
          {this.renderSquare(this.props.value.i + 0, this.props.value.j + 1)}
          {this.renderSquare(this.props.value.i + 1, this.props.value.j + 1)}
          {this.renderSquare(this.props.value.i + 2, this.props.value.j + 1)}
        </div>
        <div className="board-row">
          {this.renderSquare(this.props.value.i + 0, this.props.value.j + 2)}
          {this.renderSquare(this.props.value.i + 1, this.props.value.j + 2)}
          {this.renderSquare(this.props.value.i + 2, this.props.value.j + 2)}
        </div>
      </div>
    )
  }
}

class Board extends React.Component {

  renderBlock(i, j) {
    return (
      <Block 
        value={{
          i: i,
          j: j,
        }}
        squares={this.props.squares}
        onClick={(i, j) => this.props.onClick(i, j)}
      />
    );
  }

  render() {
    return (
      <div>
        <div className="row-of-blocks">
          {this.renderBlock(0, 0)}
          {this.renderBlock(3, 0)}
          {this.renderBlock(6, 0)}
        </div>
        <div className="row-of-blocks">
          {this.renderBlock(0, 3)}
          {this.renderBlock(3, 3)}
          {this.renderBlock(6, 3)}
        </div>
        <div className="row-of-blocks">
          {this.renderBlock(0, 6)}
          {this.renderBlock(3, 6)}
          {this.renderBlock(6, 6)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  constructor() {
    super();
    let initial = initGame();
    this.state = {
      squares: initial,
      initial: initial,
    };
  }

  handleClick(i, j) {
    const squares =  this.state.squares.slice().map( function(row){ return row.slice(); });
    if(this.state.initial[i][j])
    {
      return;
    }
    if (squares[i][j]) {
      squares[i][j]++;
      if (squares[i][j] === 10) {
        squares[i][j] = null;
      }
    }
    else {
      squares[i][j] = 1;
    }
    this.setState({
      squares: squares,
    });
  }

  render() {
    const isFinished = checkBoard(this.state.squares);
    let status;
    if (isFinished) {
      status = 'you are winner YAYYY';
    }
    return (
      <div className="game">
        <div className="game-info">
          <div>Sudoku</div>
          <div>{status}</div>
        </div>
        <div className="game-board">
          <Board 
            squares={this.state.squares}
            onClick={(i, j) => this.handleClick(i, j)}
          />
        </div>
      </div>
    );
  }
}

//this function runs genRandomGame until it successfully creates a complete sudoku puzzle
function initGame() {
  let game;
  while(true) {
    game = genRandomGame();
    if(game)
    {
      break;
    }
  }

  /*remove some cells so puzzle isn't already complete
  this is temporary until better alorithm is used */ 
  for (let i = 0; i < game.length; i++) {
    for (let j = 0; j < game[i].length; j++) {
      let rand = Math.random();
      //70% chance to blank out cell
      if (rand < 0.7) {
        game[i][j] = null;
      }
    }
  }

  return game;

}

//here we try to "smartly" use brute force to generate a new sudoku puzzle
function genRandomGame() {
        let arr = new Array(9) //this is our board to be populated with a new puzzle
        for (let i = 0; i < arr.length; i++) {
          arr[i] = Array(9).fill(null);
        }
        //this represents each cells possible value
        let possibleValues = new Array(9);
        for (let i = 0; i < arr.length; i++) {
          possibleValues[i] = new Array(9);
          for (let j = 0; j < arr.length; j++) {
            possibleValues[i][j] = Array(9).fill(true);
          }
        }

        for (let i = 0; i < arr.length; i++) {
          for (let j = 0; j < arr.length; j++) {
              let num = Math.floor(Math.random()*8); //gives us a value between 0-8
              //here we keep trying to find a possible value for the current cell until one is found
              
              while(!possibleValues[i][j][num])
              {
                let invalidPuzzle = true;
                for(let k = 0; k < 9; k++) {
                  if(possibleValues[i][j][k]) {
                    invalidPuzzle = false;
                  }
                }
                if(invalidPuzzle) {
                  return null;
                }
                console.log(possibleValues[i][j][num]);
                console.log("stuck here");
                num = (num+1)%9;
                console.log(num);
              }

              arr[i][j] = num + 1; //increment num into the range 1-9

              //update possible value list
              //update row
              for (let k = 0; k < 9; k++) {
                possibleValues[k][j][num] = false;
              }
              //update column
              for (let k = 0; k < 9; k++) {
                possibleValues[i][k][num] = false;
              }
              
              //update block
              for (let k = 0; k < 3; k++) {
                for (let l = 0; l < 3; l++) {
                  //i-i%3 and j-j%3 finds the index of the upper left corner of the current block. example 5,4 becomes 5-2,4-1 = 3,3
                  possibleValues[(i - i%3) + k][(j - j%3) + l][num] = false;
                }
              }
          }
        }
        console.log(arr);
        
        return arr;
}

//tester function to test isValidState()
function testIsValidState() {
  console.log("test valid state");
  let arr = new Array(9);
  for (let i = 0; i < arr.length; i++) {
    arr[i] = Array(9).fill(null);
  }
  arr[0][0] = 1;
  arr[0][1] = 1;
  if(isValidState(arr))
  {
    console.log("failed duplicate in column");
  }
  else
  {
    console.log("success in test 1");
  }

  arr[0][1] = 1;
  arr[1][0] = 1;
  if(isValidState(arr))
  {
    console.log("failed duplicate in row");
  }
  else
  {
    console.log("success in test 2");
  }

  arr[0][0] = 1;
  arr[1][1] = 1;
  if(isValidState(arr))
  {
    console.log("failed duplicate in square");
  }
  else
  {
    console.log("success in test 3");
  }

  arr[4][0] = 1;
  arr[5][1] = 1;
  if(isValidState(arr))
  {
    console.log("failed duplicate in square");
  }
  else
  {
    console.log("success in test 4");
  }

  console.log("test over");
}

//checks to see if current state of board is valid(ie. no repeating numbers in rows, columns or blocks)
function isValidState(state) {
  //this code is copy pasted from the function below checkBoard() except it does not return false if a board is incomplete
  //check columns
  for (let i = 0; i < 9; i++)
  {
    let seen = Array(9).fill(false);
    for (let j = 0; j < 9; j++)
    {

      //check if state at index i is not null
      if(state[i][j]) {
        //check if the value in state[i][j] has been seen before
        if(seen[state[i][j]]) {
          //if it has then there is a duplicate number, return false
          return false;
        }
        else {
          //else we mark it as seen
          seen[state[i][j]] = true;
        }
      }
    }
  }
  //check rows
  for (let j = 0; j < 9; j++)
  {
    let seen = Array(9).fill(false);
    for (let i = 0; i < 9; i++)
    {
      //check if state at index i is not null
      if(state[i][j]) {
        if(seen[state[i][j]]) {
          return false;
        }
        else {
          seen[state[i][j]] = true;
        }
      }
    }
  }
  //check squares
  for (let x = 0; x < 9; x = x + 3) {
    for (let y = 0; y < 9; y = y + 3) {
      let seen = Array(9).fill(false);
      //these two outer for loops iterate by each block, the two inner for loops iterate the inside of a single block
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          if(state[x+i][y+j]) {
            if(seen[state[x+i][y+j]]) {
              return false;
            }
            else {
              seen[state[x+i][y+j]] = true;
            }
          }
        }
      }
    }
  }
  return true;
}

//checks to see if board is completed correctly
function checkBoard(state) {
  //check columns
  for (let i = 0; i < 9; i++)
  {
    let seen = Array(9).fill(false);
    for (let j = 0; j < 9; j++)
    {

      //check if state at index i is not null
      if(state[i][j]) {
        //check if the value in state[i][j] has been seen before
        if(seen[state[i][j]]) {
          //if it has then there is a duplicate number, return false
          return false;
        }
        else {
          //else we mark it as seen
          seen[state[i][j]] = true;
        }
      }
      else {
        //here we check if a cell is left empty and return false if any are
        //we only check here while we are checking the columns because checking later is redundant
        return false;
      }
    }
  }
  //check rows
  for (let j = 0; j < 9; j++)
  {
    let seen = Array(9).fill(false);
    for (let i = 0; i < 9; i++)
    {
      //check if state at index i is not null
      if(state[i][j]) {
        if(seen[state[i][j]]) {
          return false;
        }
        else {
          seen[state[i][j]] = true;
        }
      }
    }
  }
  //check squares
  for (let x = 0; x < 9; x = x + 3) {
    for (let y = 0; y < 9; y = y + 3) {
      let seen = Array(9).fill(false);
      //these two outer for loops iterate by each block, the two inner for loops iterate the inside of a single block
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          if(state[x+i][y+j]) {
            if(seen[state[x+i][y+j]]) {
              return false;
            }
            else {
              seen[state[x+i][y+j]] = true;
            }
          }
        }
      }
    }
  }
  return true;
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
