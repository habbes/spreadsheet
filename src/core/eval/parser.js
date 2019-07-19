import { Token } from './token';
import * as types from './token-types';
import { ValueNode, CellRangeNode, FunctionCallNode } from './parse-tree';

export class Parser {
    /**
     * 
     * @param {Token[]} tokens
     */
    initParse (tokens) {
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

    consumeToken () {
        if (!this.tokens.length) {
            throw new Error('Unexpected end of input');
        }
        return this.tokens.shift();
    }

    consumeValue (...expectedValues) {
        const token = this.consumeToken();
        if (!expectedValues.includes(token.value)) {
            throw new Error(`Expected ${expectedValues.join(' or ')} but found '${token.value}'`);
        }
        return token;
    }

    consumeType (expectedType) {
        const token = this.consumeToken();
        if (token.type !== expectedType) {
            throw new Error(`Expected a ${expectedType} but found '${token.value}'`);
        }
        return token;
    }

    parseTerm() {
        const token = this.consumeToken();
        const literalTypes = [types.NUMBER_LITERAL, types.STRING_LITERAL, types.CELL_LITERAL];
        if (token.type === types.CELL_LITERAL && this.isValueAfterNext(':')) {
            this.consumeValue(':');
            const token2 = this.consumeType(types.CELL_LITERAL);
            return new CellRangeNode(token.value, token2.value);
        }

        if (literalTypes.includes(token.type)) {
            return new ValueNode(token.value, token.type);
        }
        throw new Error(`Unexpected token ${token.value}`);
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
