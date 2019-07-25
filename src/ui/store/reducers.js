import { Grid } from '../../core/grid';
import { Parser, evaluateGrid } from '../core/eval';
import * as functions from '../core/functions';

import * as types from './action-types';


const defaultGrid = new Grid();
const inputGrid = new Grid();
const parser = new Parser();

function updateInput (coord, input) {
  inputGrid.setAt(coord, input);
  const outGrid = evaluateGrid(inputGrid, functions, parser);
  return outGrid;
}

export function grid(state = defaultGrid, action) {
  switch (action.type) {
    case types.UPDATE_CELL:
      return updateInput(action.update.coord, action.update.input)
    default:
      return state;
  }
}
