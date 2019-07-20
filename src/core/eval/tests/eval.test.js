import { evaluateCellAt, evaluateFormula } from '../eval';
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
    });
});
