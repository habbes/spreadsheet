import React, { Fragment } from 'react';
import { indexCoordToAlpha } from '../../lib';
import Cell from '../Cell';
import './Grid.css';

function generateColHeaders (cols) {
    const headers = [];
    for (let i = 0; i < cols; i++) {
        headers.push(<div className="Grid--col-header" key={`Col-header-${i}`}>{ i + 1 }</div>)
    }
    return (
        <Fragment>
            <div className="Grid--col-spacer"></div>
            {headers}
        </Fragment>
    );
}

function generateCells(rows, cols) {
    const cells = [];
    for (let row = 0; row < rows; row++) {
        cells.push(<div className="Grid--row-header" key={`Row-header-${row}`}>{ row + 1 }</div>);
        for (let col = 0; col < cols; col++) {
            const id = indexCoordToAlpha([col, row])
            cells.push((
                <div className="Grid--cell-container" key={`Cell-${id}`}>
                    <Cell
                        id={`Cell-${id}`}
                        row={row}
                        col={col}
                    />
                </div>
            ));
        }
    }
    return cells;
  }

const Grid = ({ rows, cols }) => (
    <div className="Grid" style={{gridTemplateColumns: `75px repeat(${cols}, 120px)`}}>
        {generateColHeaders(cols)}
        {generateCells(rows, cols)}
    </div>
);

export default Grid;
