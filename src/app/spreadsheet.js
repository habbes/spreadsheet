import { Spreadsheet } from '../lib';
import * as functions from '../lib/functions';

const spreadsheet = new Spreadsheet(functions);
export const initialGrid = spreadsheet.evaluate();

export default spreadsheet;
