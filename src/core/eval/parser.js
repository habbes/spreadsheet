import { Token } from './token';
import * as types from './token-types';
import { CellRangeNode, FunctionCallNode, NumberNode, StringNode, CellNode } from './parse-tree';

export class Parser {
    /**
     * 
     * @param {Token[]} tokens
     */
    init (tokens) {
        this.tokens = tokens;
    }

    isValueAfterNext (expectedValue) {
        return this.tokens.length >= 2 && this.tokens[1].value === expectedValue;
    }

    isNextValue (expectedValue) {
        return this.tokens.length >= 1 && this.tokens[0].value === expectedValue;
    }

    isNextType (expectedType) {
        return this.tokens.length >= 1 && this.tokens[0].type === expectedType;
    }

    isTypeAfterNext (expectedType) {
        return this.tokens.length >= 2 && this.tokens[1].type === expectedType;
    }

    consumeNext () {
        if (!this.tokens.length) {
            throw new Error('Unexpected end of input');
        }
        return this.tokens.shift();
    }

    consumeValue (...expectedValues) {
        const token = this.consumeNext();
        if (!expectedValues.includes(token.value)) {
            throw new Error(`Expected ${expectedValues.join(' or ')} but found '${token.value}'`);
        }
        return token;
    }

    consumeType (expectedType) {
        const token = this.consumeNext();
        if (token.type !== expectedType) {
            throw new Error(`Expected a ${expectedType} but found '${token.value}'`);
        }
        return token;
    }

    parseTerm() {
        const token = this.consumeNext();
        if (token.type === types.CELL_LITERAL && this.isNextValue(':')) {
            this.consumeValue(':');
            const token2 = this.consumeType(types.CELL_LITERAL);
            return new CellRangeNode(token.value, token2.value);
        }

        switch (token.type) {
            case types.NUMBER_LITERAL:
                return new NumberNode(token.value);
            case types.STRING_LITERAL:
                return new StringNode(token.value);
            case types.CELL_LITERAL:
                return new CellNode(token.value);
            default:
                throw new Error(`Unexpected ${token.type} '${token.value}'`);
        }
    }

    parseFunctionCall() {
        const name = this.consumeType(types.IDENTIFIER);
        this.consumeValue('(');
        if (this.isNextValue(')')) {
            this.consumeValue(')');
            return new FunctionCallNode(name.value, []);
        }
        const args = [];
        args.push(this.parseExpression());

        let token = this.consumeValue(',', ')');
        while (token.value === ',') {
            args.push(this.parseExpression());
            token = this.consumeValue(',', ')');
        }
        
        return new FunctionCallNode(name, args);
    }

    parseExpression () {
        if (this.isNextType(types.IDENTIFIER)) {
            return this.parseFunctionCall();
        }
        return this.parseTerm();
    }
}
