export class Grid {
    constructor () {
        this.matrix = {};
    }

    _getKey([x, y]) {
        return `${x},${y}`;
    }

    setAt(coord, value) {
        const key = this._getKey(coord);
        if (value === '' || value === undefined || value === null) {
            delete this.matrix[key];
            return;
        }
        this.matrix[key] = value;
    }

    getAt(coord) {
        return this.matrix[this._getKey(coord)];
    }

    getCoordsInRange([x1, y1], [x2, y2]) {
        const coords = [];
        for (let y = y1; y <= y2; y++) {
            for (let x = x1; x <= x2; x++) {
                coords.push([x, y]);
            }
        }
        return coords;
    }

    getValues(coords) {
        return coords.map(coord => this.getAt(coord));
    }

    getValuesInRange(startCoord, endCoord) {
        return this.getValues(
            this.getCoordsInRange(startCoord, endCoord)
        );
    }

    getCoordsWithValues() {
        return Object.keys(this.matrix).map(
            key => key.split(',').map(c => Number(c))
        );
    }
}
