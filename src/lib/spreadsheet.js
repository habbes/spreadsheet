import { Grid } from './grid';
import { Parser, evaluateGrid } from './eval';

export class Spreadsheet {
    constructor(functions) {
        this.inputGrid = new Grid();
        this.parser = new Parser();
        this.functions = functions;
    }

    setInput(coord, input) {
        this.inputGrid.setAt(coord, input);
    }

    evaluate() {
        return evaluateGrid(this.inputGrid, this.functions, this.parser);
    }
}
