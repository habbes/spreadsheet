import { Parser } from '../parser';
import { Token } from '../token';
import { NUMBER_LITERAL, SYMBOL, STRING_LITERAL, CELL_LITERAL, IDENTIFIER } from '../token-types';
import { ValueNode, CellRangeNode } from '../parse-tree';

function symbol (value) {
    return new Token(value, SYMBOL);
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
            expect(node).toEqual(new ValueNode('"test"', STRING_LITERAL));
            expect(parser.tokens).toEqual([symbol(',')]);
        });
        it('should parse number literal', () => {
            parser.init([new Token('20.43', NUMBER_LITERAL), symbol(',')]);
            const node = parser.parseTerm();
            expect(node).toEqual(new ValueNode('20.43', NUMBER_LITERAL));
            expect(parser.tokens).toEqual([symbol(',')]);
        });
        it('should parse cell literal', () => {
            parser.init([new Token('A3', CELL_LITERAL), symbol(',')]);
            const node = parser.parseTerm();
            expect(node).toEqual(new ValueNode('A3', CELL_LITERAL));
            expect(parser.tokens).toEqual([symbol(',')]);
        });
        it('should parse cell range', () => {
            parser.init([new Token('A3', CELL_LITERAL), symbol(':'), new Token('B5', CELL_LITERAL), symbol(',')]);
            const node = parser.parseTerm();
            expect(node).toEqual(new CellRangeNode('A3', 'B5'));
            expect(parser.tokens).toEqual([symbol(',')]);
        });
        it('should throw error on unexpected syntax errors', () => {
            testError([symbol(',')], /unexpected symbol ','/i);
            testError([new Token('sum', IDENTIFIER)], /unexpected identifier 'sum'/i);
            testError([new Token('A3', CELL_LITERAL), symbol(':'), new Token('25', NUMBER_LITERAL)],
                /expected a cellLiteral but found '25'/i);
            testError([], /unexpected end of input/i);
        });
    });
});
