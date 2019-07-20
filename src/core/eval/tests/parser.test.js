import { Parser } from '../parser';
import { number, string, cell, symbol, identifier } from '../token';
import { CellRangeNode, StringNode, NumberNode, CellNode, FunctionCallNode } from '../parse-tree';



describe('Parser', () => {
    /**
     * @type Parser
     */
    let parser;
    let tokens;
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

    describe('consumeNext', () => {
        it('should consume next token and remove it from list', () => {
            tokens = [number('1'), symbol(',')];
            parser.init(tokens);
            const token = parser.consumeNext();
            expect(token).toEqual(number('1'));
            expect(parser.tokens).toEqual([symbol(',')]);
        });
        it('should throw error if there no tokens left', () => {
            parser.init([]);
            expect(() => parser.consumeNext()).toThrow(/unexpected end of input/i);
        })
    });

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
            testParse([cell('A3'), symbol(':'), cell('B5'), symbol(',')], new CellRangeNode('A3', 'B5'), [symbol(',')]);
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
            parser.init([identifier('sum'), symbol('('), symbol(')')]);
            const node = parser.parseFunctionCall();
            expect(node).toEqual(new FunctionCallNode('sum', []));
            expect(parser.tokens).toEqual([]);
        });
        it('should parse call with one arg', () => {
            parser.init([identifier('exp'), symbol('('), cell('A3'), symbol(')'), symbol(',')]);
            const node = parser.parseFunctionCall();
            expect(node).toEqual(new FunctionCallNode('exp', [new CellNode('A3')]));
            expect(parser.tokens).toEqual([symbol(',')]);
        });
        it('should parse call with multiple args', () => {
            parser.init([identifier('func'), symbol('('),
                number('23.4'), symbol(','),
                cell('B2'), symbol(','),
                string('"test"'), symbol(','),
                cell('C10'), symbol(':'), cell('C15'),
                symbol(')'), symbol(',')]);
            const node = parser.parseFunctionCall();
            expect(node).toEqual(new FunctionCallNode('func', [
                new NumberNode('23.4'), new CellNode('B2'), new StringNode('"test"'), new CellRangeNode('C10', 'C15')
            ]));
            expect(parser.tokens).toEqual([symbol(',')]);
        });
        it('should parse call with args containing other function calls', () => {
            parser.init([identifier('func'), symbol('('),
                cell('C4'), symbol(','),
                identifier('func2'), symbol('('), cell('B4'), symbol(':'), cell('G4'), symbol(')'), symbol(','),
                identifier('func3'), symbol('('), identifier('func4'), symbol('('), symbol(')'), symbol(')'), symbol(','),
                number('100'), symbol(','),
                identifier('func5'), symbol('('), number('25'), symbol(','), string('"s"'), symbol(')'),
                symbol(')')
            ]);
            const node = parser.parseFunctionCall();
            expect(node).toEqual(new FunctionCallNode('func', [
                new CellNode('C4'),
                new FunctionCallNode('func2', [
                    new CellRangeNode('B4', 'G4')
                ]),
                new FunctionCallNode('func3', [
                    new FunctionCallNode('func4', [])
                ]),
                new NumberNode('100'),
                new FunctionCallNode('func5', [
                    new NumberNode('25'), new StringNode('"s"')
                ])
            ]));
            expect(parser.tokens).toEqual([]);
        });
        it('should throw errors on unexpected syntax', () => {
            testError([], /unexpected end of input/i);
            testError([identifier('sum')], /unexpected end of input/i);
            testError([identifier('sum'), symbol('(')], /unexpected end of input/i);
            testError([identifier('sum'), symbol('('), cell('A4')], /unexpected end of input/i);
            testError([identifier('sum'), symbol('('), cell('A4'), symbol(',')], /unexpected end of input/i);

            testError([identifier('sum'), symbol('('), symbol('(')], /unexpected symbol '\('/i);
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
                new FunctionCallNode('func', [new CellRangeNode('B4', 'B10')]),
                []
            );
        });
        it('should parse term', () => {
            testParse([cell('A3')], new CellNode('A3'), []);
            testParse([cell('A3'), symbol(':'), cell('C3')], new CellRangeNode('A3', 'C3'), []);
            testParse([number('3')], new NumberNode('3'), []);
            testParse([string('"a"')], new StringNode('"a"'), []);
        });
        it('should throw error on unexpected tokens', () => {
            testError([symbol(',')], /unexpected symbol ','/i);
            testError([identifier('func')], /unexpected end of input/i);
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
        it('calls parseTerm if next token is NOT an identifier', () => {
            jest.spyOn(parser, 'parseFunctionCall');
            jest.spyOn(parser, 'parseTerm').mockReturnValue(new CellNode('A3'));
            parser.init([symbol(',')]);
            const node = parser.parseExpression();
            expect(node).toEqual(new CellNode('A3'));
            expect(parser.parseFunctionCall).not.toHaveBeenCalled();
            expect(parser.parseTerm).toHaveBeenCalled();
        });
    });
});
