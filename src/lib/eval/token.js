import { NUMBER_LITERAL, SYMBOL, STRING_LITERAL, CELL_LITERAL, IDENTIFIER } from './token-types';

export class Token {
    constructor (value, type) {
        this.value = value;
        this.type = type;
    }
}

export function symbol (value) {
    return new Token(value, SYMBOL);
}

export function identifier (value) {
    return new Token(value, IDENTIFIER);
}

export function cell (value) {
    return new Token(value, CELL_LITERAL);
}

export function string (value) {
    return new Token(value, STRING_LITERAL);
}

export function number (value) {
    return new Token(value, NUMBER_LITERAL);
}
