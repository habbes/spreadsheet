import { Grid } from '../grid';
import { Cell } from '../cell';
import { parseSource } from './parser';

export function evaluateGrid (inputGrid, functions, parser) {
    const context = new EvalContext(inputGrid, new Grid(), functions, parser);
    const coords = inputGrid.getCoordsWithValues();
    coords.forEach((coord) => {
        const cell = evaluateCellAt(coord, context);
        if (cell) {
            context.outputGrid.setAt(coord, cell);
        }
    });
    return context.outputGrid;
}

export function evaluateFormula(source, context) {
    const tree = parseSource(source, context.parser);
    return tree.evaluate(context);
}

export function evaluateCellAt(coord, context) {
    if (context.outputGrid.getAt(coord)) {
        return context.outputGrid.getAt(coord);
    }
    const input = context.inputGrid.getAt(coord);
    if (input) {
        if (isNumber(input)) {
            return new Cell(input, Number(input))
        }
        else if (input[0] === '=') {
            try {
               const value = evaluateFormula(input.slice(1), context);
               return new Cell(input, value);
            }
            catch (e) {
                return new Cell(input, undefined, e.message);
            }
        }
        else {
            return new Cell(input, input);
        }
    }
}

export class EvalContext {
    /**
     * 
     * @param {Grid} inputGrid
     * @param {Grid} outputGrid 
     * @param {object} functions
     * @param {Parser} parser 
     */
    constructor (inputGrid, outputGrid, functions, parser) {
        this.inputGrid = inputGrid;
        this.outputGrid = outputGrid;
        this.functions = functions;
        this.parser = parser;
    }
}

function isNumber(a) {
    return !isNaN(Number(a))
}
