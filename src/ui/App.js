import React from 'react';
import { indexCoordToAlpha } from '../core';

import Cell from './Cell';
import './App.css';

const COLS = 26;
const ROWS = 50;


function generateCells() {
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
        />
      ))
    }
  }
  return cells;
}

function App() {
  return (
    <div className="App">
      <header className="App-header">
      </header>
      <div className="App-formula-bar">
      </div>
      <div className="Grid" style={{gridTemplateColumns: `${new Array(COLS).fill('1fr').join(' ')}`}}>
        {generateCells()}
      </div>
    </div>
  );
}

export default App;
