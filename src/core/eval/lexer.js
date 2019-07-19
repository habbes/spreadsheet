import * as types from './token-types';
import { Token } from './token';

const tokenRules = [
    [/^\s+/, types.WHITESPACE],
    [/^[:()\-,]/, types.SYMBOL],
    [/^[0-9]+(\.[0-9]+)?/, types.NUMBER_LITERAL],
    [/^[a-zA-Z]+\d+/, types.CELL_LITERAL],
    [/^"[^"]*"/, types.STRING_LITERAL],
    [/^[a-zA-Z]+/, types.IDENTIFIER],
];

export function extractNextToken(source) {
    for (let [re, type] of tokenRules) {
        const match = re.exec(source);
        if (match && match[0]) {
            const token = new Token(match[0], type);
            const nextSource = source.slice(match[0].length);
            return [token, nextSource];
        }
    }
}

/**
 * translates source code into a list of tokens
 * @param {String} source 
 */
export function lex(source) {
    let s = source;
    const tokens = [];
    while (s) {
        const result = extractNextToken(s);
        if (!result) {
            throw new Error(`Invalid syntax near ${s}`);
        }
        const [token, remaining] = result;
        if (token.type !== types.WHITESPACE) {
            tokens.push(token);
        }
        s = remaining;
    }
    return tokens;
}


