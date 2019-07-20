import { evaluateCellAt, evaluateFormula, evaluateGrid, EvalContext } from '../eval';
import * as parser from '../parser';
import { Grid } from '../../grid';
import { Cell } from '../../cell';

describe('eval', () => {
    beforeEach(() => {
        if (parser.parseSource.mockRestore) {
            parser.parseSource.mockRestore();
        }
    });

    describe('evaluateFormula', () => {
        it('should parse formula and evaluate it', () => {
            const context = { inputGrid: {}, parser: {}, outputGrid: {} };
            const tree = {
                evaluate: jest.fn().mockReturnValue(10)
            };
            jest.spyOn(parser, 'parseSource').mockReturnValue(tree);
            const res = evaluateFormula('SUM(A3:A10)', context);
            expect(res).toBe(10);
            expect(parser.parseSource).toHaveBeenCalledWith('SUM(A3:A10)', context.parser);
            expect(tree.evaluate).toHaveBeenCalledWith(context);
        });
    });

    describe('evaluateCellAt', () => {
        let coord;
        let context;
        beforeEach(() => {
            coord = [10, 11];
            context = { inputGrid: new Grid(), outputGrid: new Grid(), parser: {} }
        });

        function testEvaluateCell(input, expectedCell) {
            context.inputGrid.setAt(coord, input);
            const cell = evaluateCellAt(coord, context);
            expect(cell).toEqual(expectedCell);
        }
        it('should evaluate number cell', () => {
            testEvaluateCell('10.23', new Cell('10.23', 10.23));
        });

        it('should evaluate string cell', () => {
            testEvaluateCell('test', new Cell('test', 'test'));
        });

        it('should evaluate formula cell', () => {
            const input = '=SUM(A3, A4)';
            const tree = {
                evaluate: jest.fn().mockReturnValue(20)
            };
            jest.spyOn(parser, 'parseSource').mockReturnValue(tree);
            testEvaluateCell(input, new Cell(input, 20));
            expect(parser.parseSource).toHaveBeenCalledWith('SUM(A3, A4)', context.parser);
            expect(tree.evaluate).toHaveBeenCalledWith(context);
        });

        it('should evaluate formula cell with error', () => {
            const input = '=SUM(10';
            jest.spyOn(parser, 'parseSource').mockImplementation(() => { throw new Error('syntax error'); });
            testEvaluateCell(input, new Cell(input, undefined, 'syntax error'));
        });

        describe('if the cell already exists in the output grid', () => {
            it('should return value from output grid without re-evaluating', () => {
                const cell = new Cell('=SUM(A3, A4)', 20);
                context.outputGrid.setAt(coord, cell);
                jest.spyOn(parser, 'parseSource')
                testEvaluateCell('=SUM(A3, A4)', cell);
                expect(parser.parseSource).not.toHaveBeenCalled();
            });
        });
    });

    describe('evaluateGrid', () => {
        it('should evaluate each input cell with values and set the evaluated cells in the output grid', () => {
            const inputGrid = new Grid();
            inputGrid.setAt([1, 2], '10');
            inputGrid.setAt([2, 3], 'test');
            inputGrid.setAt([3, 4], '=SUM(A3:A10)');
            const functions = { sum: () => {} };

            const tree = {
                evaluate: jest.fn().mockReturnValue(24)
            };
            const parserInstance = {};
            jest.spyOn(parser, 'parseSource').mockReturnValue(tree);

            const outputGrid = evaluateGrid(inputGrid, functions, parserInstance);
            expect(parser.parseSource).toHaveBeenCalledWith('SUM(A3:A10)', parserInstance);
            expect(tree.evaluate).toHaveBeenCalledWith(new EvalContext(inputGrid, outputGrid, functions, parserInstance));

            expect(outputGrid.getCoordsWithValues()).toEqual([[1, 2], [2, 3], [3, 4]]);
            expect(outputGrid.getAt([1, 2])).toEqual(new Cell('10', 10));
            expect(outputGrid.getAt([2, 3])).toEqual(new Cell('test', 'test'));
            expect(outputGrid.getAt([3, 4])).toEqual(new Cell('=SUM(A3:A10)', 24));
        });
    });
});
