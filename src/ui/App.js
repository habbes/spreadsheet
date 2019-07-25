import React from 'react';
import { indexCoordToAlpha, Grid } from '../core/grid';
import { Parser, evaluateGrid } from '../core/eval';
import * as functions from '../core/functions';
import './App.css';

const COLS = 26;
const ROWS = 50;

const inputGrid = new Grid();
const parser = new Parser();

function addInput (coord, input) {
  inputGrid.setAt(coord, input);
  const outGrid = evaluateGrid(inputGrid, functions, parser);
  return outGrid;
}

function Cell({ row, col, cell, onChange }) {
  const id = indexCoordToAlpha([col, row]);
  const value = cell ? cell.value : '';
  return (
    <div class="Cell" title={id}>
      <input
        className="Cell-input"
        value={value}
        onChange={(e) => onChange({
          input: e.target.value,
          coord: [col, row]
        })}
      />
    </div>
  )
}

function generateCells(outGrid, onChange) {
  const cells = [];
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      const id = indexCoordToAlpha([col, row])
      cells.push((
        <Cell
          key={id}
          id={`Cell-${id}`}
          row={row}
          col={col}
          cell={outGrid.getAt([col, row])}
          onChange={onChange}
        />
      ))
    }
  }
  return cells;
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      outGrid: new Grid()
    };

    this.onCellChange = this.onCellChange.bind(this);
  }

  onCellChange({ coord, input }) {
    this.setState({ outGrid: addInput(coord, input) });
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
        </header>
        <div className="App-formula-bar">
        </div>
        <div className="Grid" style={{gridTemplateColumns: `${new Array(COLS).fill('1fr').join(' ')}`}}>
          {generateCells(this.state.outGrid, this.onCellChange)}
        </div>
      </div>
    );
  }
}

export default App;
