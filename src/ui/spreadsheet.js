import { Spreadsheet } from '../core';
import * as functions from '../core/functions';

const spreadsheet = new Spreadsheet(functions);
export const initialGrid = spreadsheet.evaluate();

export default spreadsheet;
