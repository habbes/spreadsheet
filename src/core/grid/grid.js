import { Cell } from '../cell';

export class Grid {
    constructor () {
        this.matrix = {};
    }

    _getKey(x, y) {
        return `${x},${y}`;
    }

    setCellInput(x, y, input) {
        this.matrix[this._getKey(x, y)] = input;
    }

    getCellAt(x, y) {
        const input = this.matrix[this._getKey(x, y)];
        return new Cell(input);
    }
}
