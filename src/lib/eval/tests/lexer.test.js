import { extractNextToken, lex } from '../lexer';
import * as types from '../token-types';
import { Token, number, identifier, symbol, cell, string } from '../token';

describe('lexer', () => {
    describe('extractNextToken', () => {
        let source;
        beforeEach(() => {
            source = 'SUM(A3:A10, 1, 2)';
        });
    
        function testExtraction(expectedToken, expectedOutSource) {
            const [token, out] = extractNextToken(source);
            expect(token).toEqual(expectedToken);
            expect(out).toEqual(expectedOutSource);
        }
    
        it('should extract next token and return remaining string', () => {
            testExtraction(new Token('SUM', types.IDENTIFIER), '(A3:A10, 1, 2)')
        });
        it('should extract symbols', () => {
            source = '(A';
            testExtraction(new Token('(', types.SYMBOL), 'A');
            source = ')';
            testExtraction(new Token(')', types.SYMBOL), '');
            source = ':B';
            testExtraction(new Token(':', types.SYMBOL), 'B');
            source = '-C1';
            testExtraction(new Token('-', types.SYMBOL), 'C1');
            source = ',B(';
            testExtraction(new Token(',', types.SYMBOL), 'B(');
        });
        it('should extract cell literals', () => {
            source = 'A3:B3';
            testExtraction(new Token('A3', types.CELL_LITERAL), ':B3');
            source = 'B36, A25';
            testExtraction(new Token('B36', types.CELL_LITERAL), ', A25');
        });
        it('should extract number literals', () => {
            source = '124,B2';
            testExtraction(new Token('124', types.NUMBER_LITERAL), ',B2');
            source = '245.23, A25';
            testExtraction(new Token('245.23', types.NUMBER_LITERAL), ', A25');
            source = '-24.3,B2';
            testExtraction(number('-24.3'), ',B2');
        });
        it('should extract string literals', () => {
            source = '"john\'s phone",two';
            testExtraction(new Token('"john\'s phone"', types.STRING_LITERAL), ',two');
            source = '"",32';
            testExtraction(new Token('""', types.STRING_LITERAL), ',32');
        });
        it('should extract identifiers', () => {
            source = 'sum(24,32)';
            testExtraction(new Token('sum', types.IDENTIFIER), '(24,32)');
            source = 'pi,32';
            testExtraction(new Token('pi', types.IDENTIFIER), ',32');
        });
        it('should extract whitespace', () => {
            source = '  , sum(23)';
            testExtraction(new Token('  ', types.WHITESPACE), ', sum(23)');
        });
        it('should return undefined if no token matches', () => {
            source = "'";
            expect(extractNextToken(source)).toBeUndefined();
        });
    });

    describe('lex', () => {
        it('should translate source code into a list of tokens without whitespace', () => {
            const source = 'SUM(A3:B10, 10, 20.3, -10, 0, "test")';
            const tokens = lex(source);
            expect(tokens).toEqual([
                identifier('SUM'),
                symbol('('),
                cell('A3'),
                symbol(':'),
                cell('B10'),
                symbol(','),
                number('10'),
                symbol(','),
                number('20.3'),
                symbol(','),
                number('-10'),
                symbol(','),
                number('0'),
                symbol(','),
                string('"test"'),
                symbol(')')
            ]);
        });
        it('should throw exception on syntax errors', () => {
            const source = 'SUM(A3:B10;[';
            try {
                lex(source);
                jest.fail('should throw error');
            }
            catch (e) {
                expect(/invalid syntax near ;\[/i.test(e.message)).toBe(true);
            }
        });
    });
});
