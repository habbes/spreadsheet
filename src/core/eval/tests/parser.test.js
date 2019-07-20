import { Parser } from '../parser';
import { Token } from '../token';
import { NUMBER_LITERAL, SYMBOL, STRING_LITERAL, CELL_LITERAL, IDENTIFIER } from '../token-types';
import { CellRangeNode, StringNode, NumberNode, CellNode, FunctionCallNode } from '../parse-tree';

function symbol (value) {
    return new Token(value, SYMBOL);
}

function identifier (value) {
    return new Token(value, IDENTIFIER);
}

function cell (value) {
    return new Token(value, CELL_LITERAL);
}

function string (value) {
    return new Token(value, STRING_LITERAL);
}

function number (value) {
    return new Token(value, NUMBER_LITERAL);
}

describe('Parser', () => {
    /**
     * @type Parser
     */
    let parser;
    let tokens;
    beforeEach(() => {
        parser = new Parser();
    });

    function createErrorTesterFor(parseFn) {
        return (tokens, messageRe) => {
            parser.init(tokens);
            expect(parseFn).toThrow(messageRe);
        }
    }

    describe('consumeNext', () => {
        it('should consume next token and remove it from list', () => {
            tokens = [new Token('1', NUMBER_LITERAL), symbol(',')];
            parser.init(tokens);
            const token = parser.consumeNext();
            expect(token).toEqual(new Token('1', NUMBER_LITERAL));
            expect(parser.tokens).toEqual([new Token(',', SYMBOL)]);
        });
        it('should throw error if there no tokens left', () => {
            parser.init([]);
            expect(() => parser.consumeNext()).toThrow(/unexpected end of input/i);
        })
    });

    describe('parseTerm', () => {
        const testError = createErrorTesterFor(() => parser.parseTerm());
        it('should parse string literal', () => {
            parser.init([new Token('"test"', STRING_LITERAL), symbol(',')]);
            const node = parser.parseTerm();
            expect(node).toEqual(new StringNode('"test"'));
            expect(parser.tokens).toEqual([symbol(',')]);
        });
        it('should parse number literal', () => {
            parser.init([new Token('20.43', NUMBER_LITERAL), symbol(',')]);
            const node = parser.parseTerm();
            expect(node).toEqual(new NumberNode('20.43'));
            expect(parser.tokens).toEqual([symbol(',')]);
        });
        it('should parse cell literal', () => {
            parser.init([new Token('A3', CELL_LITERAL), symbol(',')]);
            const node = parser.parseTerm();
            expect(node).toEqual(new CellNode('A3'));
            expect(parser.tokens).toEqual([symbol(',')]);
        });
        it('should parse cell range', () => {
            parser.init([new Token('A3', CELL_LITERAL), symbol(':'), new Token('B5', CELL_LITERAL), symbol(',')]);
            const node = parser.parseTerm();
            expect(node).toEqual(new CellRangeNode('A3', 'B5'));
            expect(parser.tokens).toEqual([symbol(',')]);
        });
        it('should throw error when syntax errors found', () => {
            testError([symbol(',')], /unexpected symbol ','/i);
            testError([new Token('sum', IDENTIFIER)], /unexpected identifier 'sum'/i);
            testError([new Token('A3', CELL_LITERAL), symbol(':'), new Token('25', NUMBER_LITERAL)],
                /expected cellLiteral but found numberLiteral '25'/i);
            testError([], /unexpected end of input/i);
        });
    });

    describe('parseFunctionCall', () => {
        const testError = createErrorTesterFor(() => parser.parseFunctionCall());

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
        it('should throw errors on expected tokens', () => {
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
});
