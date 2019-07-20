
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
}

export class NumberNode extends ParseTree {
    type = 'number';
}

export class CellNode extends ParseTree {
    type = 'cell';
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
