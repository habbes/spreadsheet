import spreadsheet, { initialGrid } from '../spreadsheet';
import * as types from './action-types';

function updateInput (coord, input) {
  spreadsheet.setInput(coord, input);
  return spreadsheet.evaluate();
}

export function grid(state = initialGrid, action) {
  switch (action.type) {
    case types.UPDATE_CELL:
      return updateInput(action.update.coord, action.update.input)
    default:
      return state;
  }
}
