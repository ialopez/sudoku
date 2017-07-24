import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { initGame, checkBoard } from './GenNewPuzzle';

function Square(props) {
  if(props.value)
  {
    return (
      <input className="square" type="text" value={props.value} onChange={props.onChange} />
    )
  }
  else{
    return (
      <input className="square" type="text" value="" onChange={props.onChange} />
    )
  }
}

function PermanentSquare(props) {
  return (
    <input className="permanent-square" value={props.value} />
  )
}

class Block extends React.Component {
  renderSquare(i, j) {
    if(this.props.initial[i][j])
    {
      return (
        <PermanentSquare
          value={this.props.squares[i][j]}
        />
      )
    }
    else
    {
      return (
        <Square
          value={this.props.squares[i][j]}
          onChange={(event) => this.props.onChange(i, j, event)}
        />
      )
    }
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
        initial={this.props.initial}
        squares={this.props.squares}
        onChange={(i, j, event) => this.props.onChange(i, j, event)}
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

  handleChange(i, j, event) {
    const squares =  this.state.squares.slice().map( function(row){ return row.slice(); });
    let num = parseInt(event.target.value);
    if(1 <= num && num <= 9)
    {
      squares[i][j] = num;
    }
    else
    {
      if(event.target.value.length > 1)
      {
        num = parseInt(event.target.value[1]);
        if(1 <= num && num <= 9)
        {
          squares[i][j] = num;
        }
        else
        {
          squares[i][j] = null;
        }
      }
      else
      {
        squares[i][j] = null;
      }
    }
    console.log(squares);
    this.setState({
      squares: squares,
    });
    console.log(this.state);
  }

  render() {
    const isFinished = checkBoard(this.state.squares);
    let status;
    if (isFinished) {
      status = 'Congratulations! you finished the puzzle';
    }
    return (
      <div className="game">
        <div className="game-info">
          <div>Sudoku</div>
          <div className="win-status" >{status}</div>
        </div>
        <div className="game-board">
          <Board 
            initial={this.state.initial}
            squares={this.state.squares}
            onChange={(i, j, event) => this.handleChange(i, j, event)}
          />
        </div>
      </div>
    );
  }
}





// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
