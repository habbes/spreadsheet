import { makeNumberReducer } from './helpers';

export const sum = makeNumberReducer('SUM', (a, b) => a + b, 0);

export const product = makeNumberReducer('PRODUCT', (a, b) => a * b, 1);

export const count = makeNumberReducer('COUNT', a => a + 1, 0);

const avgCounter = makeNumberReducer('AVG', ([total, count], curr) => [total + curr, count + 1], [0, 0]);


export function avg (...args) {
    const [total, count] = avgCounter(...args);
    return total / count;
}
