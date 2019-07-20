export class Grid {
    constructor () {
        this.matrix = {};
    }

    _getKey(x, y) {
        return `${x},${y}`;
    }

    setAt(x, y, value) {
        const key = this._getKey(x, y);
        if (value === '' || value === undefined || value === null) {
            delete this.matrix[key];
            return;
        }
        this.matrix[key] = value;
    }

    getAt(x, y) {
        return this.matrix[this._getKey(x, y)];
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

    getValues(coords) {
        return coords.map(([x, y]) => this.getAt(x, y));
    }

    getValuesInRange(x1, y1, x2, y2) {
        return this.getValues(
            this.getCoordsInRange(x1, y1, x2, y2)
        )
    }

    getCoordsWithValues() {
        return Object.keys(this.matrix).map(
            key => key.split(',').map(c => Number(c))
        )
    }
}
