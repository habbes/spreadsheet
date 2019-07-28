import { NumberNode, StringNode, CellNode, CellRangeNode, FunctionCallNode, NegativeNode, AdditionNode, SubtractionNode, MultiplicationNode, DivisionNode } from '../parse-tree';
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

    function testError(node, expectedError) {
        expect(() => node.evaluate(context)).toThrow(expectedError);
    }

    describe('NumberNode', () => {
        it('should return number value', () => {
            testEvaluate(new NumberNode('24.5'), 24.5);
        });
        it('should return negative number value', () => {
            testEvaluate(new NumberNode('-12.3'), -12.3);
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
            expect(() => new CellNode('x24').evaluate(context)).toThrow(/error found in dependent cell 'X24'/i);
            expect(evaluator.evaluateCellAt).toHaveBeenCalledWith([23, 23], context);
        });
    });

    describe('CellRangeNode', () => {
        it('should evaluate all cells in range and return array of their values', () => {
            const cell1 = new Cell('10', 20),
                cell2 = new Cell('=SUM(a3:b5', 13.4),
                cell3 = new Cell('"test"', 'test');

            jest.spyOn(evaluator, 'evaluateCellAt')
                .mockReturnValueOnce(cell1)
                .mockReturnValueOnce(cell2)
                .mockReturnValueOnce(cell3);
            
            testEvaluate(new CellRangeNode(['C4', 'C6']), [20, 13.4, 'test']);
            expect(evaluator.evaluateCellAt.mock.calls).toEqual([
                [[2, 3], context],
                [[2, 4], context],
                [[2, 5], context]
            ])
        });
        it('should skip not include undefined cells in result values', () => {
            const cell1 = new Cell('10', 20),
                cell2 = new Cell(undefined),
                cell3 = new Cell('"test"', 'test');
            
            jest.spyOn(evaluator, 'evaluateCellAt')
                .mockReturnValueOnce(cell1)
                .mockReturnValueOnce(cell2)
                .mockReturnValueOnce(cell3);
            
            testEvaluate(new CellRangeNode(['C4', 'C6']), [20, 'test']);
        });
        it('should throw error if a cell in the range contains an error', () => {
            const cell1 = new Cell('10', 20),
                cell2 = new Cell('=Sum(A', undefined, 'syntax error'),
                cell3 = new Cell('"test"', 'test');
            
            jest.spyOn(evaluator, 'evaluateCellAt')
                .mockReturnValueOnce(cell1)
                .mockReturnValueOnce(cell2)
                .mockReturnValueOnce(cell3);
            
            expect(() => new CellRangeNode(['C4', 'C6']).evaluate(context)).toThrow(/error found in dependent cell 'C5'/i);
        });
    });

    describe('NegativeNode', () => {
        it('should return the negative of the evaluated child', () => {
            let child = {
                evaluate: jest.fn().mockReturnValue(10)
            };
            testEvaluate(new NegativeNode(child), -10);
            child = {
                evaluate: jest.fn().mockReturnValue(-20)
            };
            testEvaluate(new NegativeNode(child), 20);
        });
        it('should throw error if child does not evaluate to a number', () => {
            let child = {
                evaluate: jest.fn().mockReturnValue('non number')
            };
            testError(new NegativeNode(child), /cannot get negative of non-number/i);
            child = {
                evaluate: jest.fn().mockReturnValue([1, 2])
            };
            testError(new NegativeNode(child), /cannot get negative of non-number/i);
        });
    });

    describe('FunctionCallNode', () => {
        it('should call function with the same name, passing evaluated children as args', () => {
            const child1 = {
                evaluate: jest.fn().mockReturnValue(5)
            };
            const child2 = {
                evaluate: jest.fn().mockReturnValue(15)
            };
            testEvaluate(new FunctionCallNode('sum', [child1, child2]), 20);
            expect(child1.evaluate).toHaveBeenCalledWith(context);
            expect(child2.evaluate).toHaveBeenCalledWith(context);
            expect(context.functions.sum).toHaveBeenCalledWith(5, 15);
        });
        it('should treat function name as case-insensitive', () => {
            const child1 = { evaluate: jest.fn().mockReturnValue(10) };
            testEvaluate(new FunctionCallNode('SUM', [child1]), 20);
            expect(context.functions.sum).toHaveBeenCalledWith(10);
        });
        it('should support functions with no arguments', () => {
            testEvaluate(new FunctionCallNode('sum', []), 20);
            expect(context.functions.sum).toHaveBeenCalledWith();
        });
        it('should throw error if function does not exist', () => {
            expect(() => new FunctionCallNode('What', []).evaluate(context))
                .toThrow(/unknown function 'What'/i);
        });
        it('should throw error if a child throws an error when evaluated', () => {
            const child1 = { evaluate: jest.fn().mockReturnValue(10) };
            const child2 = { evaluate: jest.fn().mockImplementation(() => { throw new Error('some error'); })};

            expect(() => new FunctionCallNode('sum', [child1, child2]).evaluate(context))
                .toThrow(/some error/i);
        });
    });

    describe('Binary arithmetic operators', () => {
        let left;
        let right;
        beforeEach(() => {
            left = {
                evaluate: jest.fn().mockReturnValue(10)
            };
            right = {
                evaluate: jest.fn().mockReturnValue(20)
            };
        });

        function testBinaryOperator(Node, expectedValue) {
            testEvaluate(new Node(left, right), expectedValue);
            expect(left.evaluate).toHaveBeenCalledWith(context);
            expect(right.evaluate).toHaveBeenCalledWith(context);
        }
        function testArgumentError(Node, expectedError) {
            left = {
                evaluate: jest.fn().mockReturnValue('test')
            };
            const node = new Node(left, right);
            testError(node, `Invalid argument for operator ${node.value}`);
        }

        describe('AdditionNode', () => {
            it('should evaluate left and right operands and return their sum', () => {
                testBinaryOperator(AdditionNode, 30);
            });
            it('should throw error if an argument is not a number', () => {
                testArgumentError(AdditionNode);
            });
        });

        describe('SubtractionNode', () => {
            it('should evaluate left and right operands and return their difference', () => {
                testBinaryOperator(SubtractionNode, -10);
            });
            it('should throw error if an argument is not a number', () => {
                testArgumentError(SubtractionNode);
            });
        });

        describe('MultiplicationNode', () => {
            it('should evaluate left and right operands and return their product', () => {
                testBinaryOperator(MultiplicationNode, 200);
            });
            it('should throw error if an argument is not a number', () => {
                testArgumentError(MultiplicationNode);
            });
        });

        describe('DivisionNode', () => {
            it('should evaluate left and right operands and return their product', () => {
                testBinaryOperator(DivisionNode, 0.5);
            });
            it('should throw error if an argument is not a number', () => {
                testArgumentError(DivisionNode);
            });
            it('should throw error if right argument is 0', () => {
                right = {
                    evaluate: jest.fn().mockReturnValue(0)
                };
                testError(new DivisionNode(left, right), /cannot divide by 0/i);
            });
        });
    });
});
