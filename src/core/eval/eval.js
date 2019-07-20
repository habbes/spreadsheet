import { Grid } from '../grid';
import { Cell } from '../cell';
import { parseSource } from './parser';

export function evaluateGrid (grid, parser) {
    const context = new EvalContext(grid, parser, {});
    const coords = grid.getCoordsWithInputs();
    coords.forEach((coord) => {
        const key = grid._getKey(...coord);
        this.cache[key] = evaluateCellAt(coord, context);
    });
    return this.cache;
}

/**
 * 
 * @param {string} source 
 * @param {EvalContext} context 
 */
export function evaluateFormula(source, context) {
    const tree = parseSource(source, context.parser);
    return tree.evaluate(context);
}

/**
 * 
 * @param {number[]} coords
 * @param {EvalContext} context
 * @return {Cell}
 */
export function evaluateCellAt([x, y], context) {
    const key = context.grid._getKey(x, y);
    if (key in context.cache) {
        return context.cache[key];
    }
    const { input } = context.grid.getAt(x, y);
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

function isNumber(a) {
    return !isNaN(Number(a))
}

class EvalContext {
    /**
     * 
     * @param {Grid} grid 
     * @param {Parser} parser 
     * @param {any} cache 
     */
    constructor (grid, parser, cache) {
        this.grid = grid;
        this.parser = parser;
        this.cache = cache;
    }
}
