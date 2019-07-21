import { alphaToIndexCoord } from '../grid';
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
        return cell ? cell.value : undefined;
    }
}

export class CellRangeNode extends ParseTree {
    type = 'cellRange';

    constructor (startCell, endCell) {
        super([startCell, endCell])
    }
}

export class FunctionCallNode extends ParseTree {
    type = 'functionCall';
}
