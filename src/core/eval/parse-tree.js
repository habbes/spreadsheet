
export class ParseTree {
    constructor (value, children) {
        this.value = value;
        this.children = children;
    }

    evaluate () {
        throw new Error('Not implemented');
    }
}

export class NumberTree extends ParseTree {

}

export class StringTree extends ParseTree {
}

export class CellRangeNode extends ParseTree {
    constructor (startCell, endCell) {
        super(null, [startCell, endCell])
    }
}

export class ValueNode extends ParseTree {
    constructor (value, type) {
        super(value);
        this.type = type;
    }
}

export class FunctionCallNode extends ParseTree {

}
