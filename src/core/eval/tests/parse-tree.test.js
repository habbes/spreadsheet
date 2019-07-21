import { NumberNode, StringNode, CellNode } from '../parse-tree';
import { Grid } from '../../grid';
import { Parser } from '../parser';
import * as evaluator from '../eval';
import { Cell } from '../../cell';

describe('ParseTree.evaluate()', () => {
    let context;
    const functions = {
        sum: jest.fn().mockReturnValue(20)
    };

    beforeEach(() => {
        const inputGrid = new Grid();
        const outputGrid = new Grid();
        const parser = new Parser();
        if (evaluator.evaluateCellAt.mockRestore) {
            evaluator.evaluateCellAt.mockRestore();
        }

        inputGrid.setAt([1, 2], '10');

        context = {
            inputGrid,
            outputGrid,
            functions,
            parser
        };
    });

    function testEvaluate(node, expectedValue) {
        expect(node.evaluate(context)).toEqual(expectedValue);
    }

    describe('NumberNode', () => {
        it('should number value', () => {
            testEvaluate(new NumberNode('24.5'), 24.5);
        });
    });

    describe('StringNode', () => {
        it('should return string value', () => {
            testEvaluate(new StringNode('"test"'), 'test');
        });
    });

    describe('CellNode', () => {
        it('should evaluate cell and return result value', () => {
            jest.spyOn(evaluator, 'evaluateCellAt').mockReturnValue(new Cell('10', 10));
            testEvaluate(new CellNode('B3'), 10);
            expect(evaluator.evaluateCellAt).toHaveBeenCalledWith([1, 2], context);
        });
        it('should return undefined if evaluated cell is undefined', () => {
            jest.spyOn(evaluator, 'evaluateCellAt').mockReturnValue(undefined);
            testEvaluate(new CellNode('A43'), undefined);
            expect(evaluator.evaluateCellAt).toHaveBeenCalledWith([0, 42], context);
        });
        it('should throw error if evaluated cell has error', () => {
            jest.spyOn(evaluator, 'evaluateCellAt').mockReturnValue(new Cell('=SUM', undefined, 'syntax error'));
            expect(() => new CellNode('X24').evaluate(context)).toThrow(/error found in dependent cell 'X24'/i);
            expect(evaluator.evaluateCellAt).toHaveBeenCalledWith([23, 23], context);
        });
    });
});
