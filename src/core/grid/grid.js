import { Cell } from '../cell';

export class Grid {
    constructor () {
        this.matrix = {};
    }

    _getKey(x, y) {
        return `${x},${y}`;
    }

    setCellInput(x, y, input) {
        const key = this._getKey(x, y);
        if (input === '' || input === undefined || input === null) {
            delete this.matrix[key];
            return;
        }
        this.matrix[key] = input;
    }

    getCellAt(x, y) {
        const input = this.matrix[this._getKey(x, y)];
        return new Cell(input);
    }

    getCoordsInRange(x1, y1, x2, y2) {
        const coords = [];
        for (let y = y1; y <= y2; y++) {
            for (let x = x1; x <= x2; x++) {
                coords.push([x, y]);
            }
        }
        return coords;
    }

    getCells(coords) {
        return coords.map(([x, y]) => this.getCellAt(x, y));
    }

    getCellsInRange(x1, y1, x2, y2) {
        return this.getCells(
            this.getCoordsInRange(x1, y1, x2, y2)
        )
    }

    getCoordsWithInputs() {
        return Object.keys(this.matrix).map(
            key => key.split(',').map(c => Number(c))
        )
    }
}
