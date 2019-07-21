import { alphaToIndexCoord, getCoordsInRange } from '../grid';
import { evaluateCellAt} from './eval';

export class ParseTree {
    constructor (value, children) {
        this.value = value;
        this.children = children;
        this.type = null;
    }

    evaluate () {
        throw new Error('Not implemented');
    }
}

export class StringNode extends ParseTree {
    type = 'string';

    evaluate () {
        return this.value.slice(1, this.value.length - 1);
    }
}

export class NumberNode extends ParseTree {
    type = 'number';

    evaluate () {
        return Number(this.value);
    }
}

export class CellNode extends ParseTree {
    type = 'cell';

    evaluate (context) {
        const coord = alphaToIndexCoord(this.value);
        const cell = evaluateCellAt(coord, context);
        if (!cell) {
            return;
        }
        if (cell.value) {
            return cell.value;
        }
        if (cell.error) {
            throw new Error(`Error found in dependent cell '${this.value}'`);
        }
    }
}

export class CellRangeNode extends ParseTree {
    type = 'cellRange';

    evaluate (context) {
        const [start, end] = this.value.map(alphaToIndexCoord);
        const coords = getCoordsInRange(start, end);
        const cells = [];
        for (const coord of coords) {
            const cell = evaluateCellAt(coord, context);
            if (!cell) {
                return;
            }
            if (cell.value) {
                cells.push(cell.value);
            }
            if (cell.error) {
                throw new Error(`Error found in dependent cell '${coord}'`);
            }
        }
        return cells;
    }
}

export class FunctionCallNode extends ParseTree {
    type = 'functionCall';

    evaluate (context) {
        const fn = context.functions[this.value];
        if (!fn) {
            throw new Error(`Unknown function ${this.value}`);
        }
        const args = this.children.map(node => node.evaluate(context));
        return fn(...args);
    }
}
