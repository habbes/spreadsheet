import { NumberNode, StringNode, CellNode } from '../parse-tree';
import { Grid } from '../../grid';
import { Parser } from '../parser';

describe('ParseTree.evaluate()', () => {
    let context;
    const functions = {
        sum: jest.fn().mockReturnValue(20)
    };

    beforeEach(() => {
        const inputGrid = new Grid();
        const outputGrid = new Grid();
        const parser = new Parser();

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
        it('should evaluate cell and return result', () => {
            testEvaluate(new CellNode('B3'), 10);

            testEvaluate(new CellNode('B2'), undefined);
        });
    });
});
