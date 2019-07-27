import { Parser, parseSource } from '../parser';
import { number, string, cell, symbol, identifier } from '../token';
import { NumberNode, StringNode, CellNode, CellRangeNode, FunctionCallNode, NegativeNode } from '../parse-tree';

describe('Parser', () => {
    /**
     * @type Parser
     */
    let parser;
    beforeEach(() => {
        parser = new Parser();
    });

    function createParseTestersFor(parseFn) {
        return {
            /**
             * tests whether the parser function returns the
             * expected node given the specified tokens
             * and whether the expected tokens remains
             */
            testParse (initTokens, expectedNode, expectedTokensAfter) {
                parser.init(initTokens);
                const node = parseFn();
                expect(node).toEqual(expectedNode);
                expect(parser.tokens).toEqual(expectedTokensAfter);
            },

            /**
             * tests whether the specified parser function
             * throws the specified error given the specified
             * input tokens
             */
            testError (tokens, messageRe) {
                parser.init(tokens);
                expect(parseFn).toThrow(messageRe);
            }
        };
    }

    describe('parseTerm', () => {
        const { testParse, testError } = createParseTestersFor(() => parser.parseTerm());
    
        it('should parse string literal', () => {
            testParse([string('"test"'), symbol(',')], new StringNode('"test"'), [symbol(',')]);
        });
        it('should parse number literal', () => {
            testParse([number('20.43'), symbol(',')], new NumberNode('20.43'), [symbol(',')]);
        });
        it('should parse cell literal', () => {
            testParse([cell('A3'), symbol(',')], new CellNode('A3'), [symbol(',')]);
        });
        it('should parse cell range', () => {
            testParse(
                [cell('A3'), symbol(':'), cell('B5'), symbol(',')],
                new CellRangeNode(['A3', 'B5']),
                [symbol(',')]
            );
        });
        it('should throw error when syntax errors found', () => {
            testError([symbol(',')], /unexpected symbol ','/i);
            testError([identifier('sum')], /unexpected identifier 'sum'/i);
            testError([cell('A3'), symbol(':'), number('25')],
                /expected cellLiteral but found numberLiteral '25'/i);
            testError([], /unexpected end of input/i);
        });
    });

    describe('parseFunctionCall', () => {
        const { testParse, testError } = createParseTestersFor(() => parser.parseFunctionCall());

        it('should parse call with no args', () => {
            testParse([identifier('sum'), symbol('('), symbol(')')], new FunctionCallNode('sum', []), []);
        });
        it('should parse call with one arg', () => {
            testParse(
                [identifier('exp'), symbol('('), cell('A3'), symbol(')'), symbol(',')],
                new FunctionCallNode('exp', [new CellNode('A3')]),
                [symbol(',')]
            );
        });
        it('should parse call with multiple args', () => {
            testParse(
                [
                    identifier('func'), symbol('('),
                    number('23.4'), symbol(','),
                    cell('B2'), symbol(','),
                    string('"test"'), symbol(','),
                    cell('C10'), symbol(':'), cell('C15'),
                    symbol(')'), symbol(',')
                ],
                new FunctionCallNode('func', [
                    new NumberNode('23.4'),
                    new CellNode('B2'),
                    new StringNode('"test"'),
                    new CellRangeNode(['C10', 'C15'])
                ]),
                [symbol(',')]
            );
        });
        it('should parse call with args containing other function calls', () => {
            testParse(
                [
                    identifier('func'), symbol('('),
                    cell('C4'), symbol(','),
                    identifier('func2'), symbol('('), cell('B4'), symbol(':'), cell('G4'), symbol(')'), symbol(','),
                    identifier('func3'), symbol('('), identifier('func4'), symbol('('), symbol(')'), symbol(')'), symbol(','),
                    number('100'), symbol(','),
                    identifier('func5'), symbol('('), number('25'), symbol(','), string('"s"'), symbol(')'),
                    symbol(')')
                ],
                new FunctionCallNode('func', [
                    new CellNode('C4'),
                    new FunctionCallNode('func2', [
                        new CellRangeNode(['B4', 'G4'])
                    ]),
                    new FunctionCallNode('func3', [
                        new FunctionCallNode('func4', [])
                    ]),
                    new NumberNode('100'),
                    new FunctionCallNode('func5', [
                        new NumberNode('25'), new StringNode('"s"')
                    ])
                ]),
                []
            );
        });
        it('should throw errors on unexpected syntax', () => {
            testError([], /unexpected end of input/i);
            testError([identifier('sum')], /unexpected end of input/i);
            testError([identifier('sum'), symbol('(')], /unexpected end of input/i);
            testError([identifier('sum'), symbol('('), cell('A4')], /unexpected end of input/i);
            testError([identifier('sum'), symbol('('), cell('A4'), symbol(',')], /unexpected end of input/i);

            testError([identifier('sum'), symbol('('), symbol('(')], /unexpected end of input/i);
            testError([identifier('sum'), symbol('('), number('24'), symbol('-')], /expected , or \) but found '-'/i);
            testError([cell('a3')], /expected identifier but found cellLiteral 'a3'/i);
            testError([identifier('sum'), symbol('('), identifier('func2'), symbol(')')], /expected \( but found '\)'/i);
        });
    });

    describe('parseExpression', () => {
        const { testParse, testError } = createParseTestersFor(() => parser.parseExpression());

        it('should parse function call', () => {
            testParse(
                [identifier('func'), symbol('('), cell('B4'), symbol(':'), cell('B10'), symbol(')')],
                new FunctionCallNode('func', [new CellRangeNode(['B4', 'B10'])]),
                []
            );
        });
        it('should parse term', () => {
            testParse([cell('A3')], new CellNode('A3'), []);
            testParse([cell('A3'), symbol(':'), cell('C3')], new CellRangeNode(['A3', 'C3']), []);
            testParse([number('3')], new NumberNode('3'), []);
            testParse([string('"a"')], new StringNode('"a"'), []);
        });
        it('calls parseFunctionCall if next token is an identifier', () => {
            jest.spyOn(parser, 'parseFunctionCall').mockReturnValue(new FunctionCallNode('test', []));
            jest.spyOn(parser, 'parseTerm');
            parser.init([identifier('test')]);
            const node = parser.parseExpression();
            expect(node).toEqual(new FunctionCallNode('test', []));
            expect(parser.parseFunctionCall).toHaveBeenCalled();
            expect(parser.parseTerm).not.toHaveBeenCalled();
        });
        it('calls parseTerm if next token is NOT an identifier or -', () => {
            jest.spyOn(parser, 'parseFunctionCall');
            jest.spyOn(parser, 'parseTerm').mockReturnValue(new CellNode('A3'));
            parser.init([symbol(',')]);
            const node = parser.parseExpression();
            expect(node).toEqual(new CellNode('A3'));
            expect(parser.parseFunctionCall).not.toHaveBeenCalled();
            expect(parser.parseTerm).toHaveBeenCalled();
        });
        it('should parse negative expression', () => {
            testParse(
                [symbol('-'), cell('A3')],
                new NegativeNode(
                    new CellNode('A3')
                ),
                []
            );
            testParse(
                [symbol('-'), identifier('sum'), symbol('('), cell('A3'), symbol(':'), cell('A5'), symbol(')')],
                new NegativeNode(
                    new FunctionCallNode('sum', [
                        new CellRangeNode(['A3', 'A5'])
                    ])
                ),
                []
            );
        });
        it('should parse expression with enclosing parentheses', () => {
            testParse(
                [symbol('('), cell('A3'), symbol(')')],
                new CellNode('A3'),
                []
            );

            testParse(
                [symbol('-'), symbol('('), number('-10'), symbol(')'), symbol(',')],
                new NegativeNode(
                    new NumberNode('-10')
                ),
                [symbol(',')]
            );

            testParse(
                [symbol('('), symbol('('), string('"test"'), symbol(')'), symbol(')')],
                new StringNode('"test"'),
                []
            );
        });

        it('should throw error on unexpected tokens', () => {
            testError([symbol(',')], /unexpected symbol ','/i);
            testError([identifier('func')], /unexpected end of input/i);
            testError([symbol('('), symbol('('), number('10'), symbol(')')], /unexpected end of input/i);
            testError([], /unexpected end of input/i);
        });
    });
});

describe('parseSource', () => {
    const parser = new Parser();

    function testParseSource(source, expected) {
        const tree = parseSource(source, parser);
        expect(tree).toEqual(expected);
    }

    function testParseSourceError(source, expectedError) {
        expect(() => parseSource(source, parser)).toThrow(expectedError);
    }

    it('should transform expression source code into parse tree', () => {
        testParseSource(
            'A3',
            new CellNode('A3')
        );
        
        testParseSource(
            '25.3',
            new NumberNode('25.3')
        );

        testParseSource(
            '"test"',
            new StringNode('"test"')
        );

        testParseSource(
            'SUM(A3:A10, 30, "two", AVG(A5, B4))',
            new FunctionCallNode('SUM', [
                new CellRangeNode(['A3', 'A10']),
                new NumberNode('30'),
                new StringNode('"two"'),
                new FunctionCallNode('AVG', [
                    new CellNode('A5'), new CellNode('B4')
                ])
            ])
        );
    });

    it('should throw error on invalid error', () => {
        testParseSourceError('SUM([', /invalid syntax near \[/i);
        testParseSourceError('SUM(A3,', /unexpected end of input/i);
    });
});
