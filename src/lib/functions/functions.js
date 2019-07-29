import { makeFlatteningNumberReducer, makeFlatteningReducer } from './helpers';

export const sum = makeFlatteningNumberReducer('SUM', (a, b) => a + b, 0);

export const product = makeFlatteningNumberReducer('PRODUCT', (a, b) => a * b, 1);

export const count = makeFlatteningReducer(a => a + 1, 0);

const avgCounter = makeFlatteningNumberReducer('AVG', ([total, count], curr) => [total + curr, count + 1], [0, 0]);


export function avg (...args) {
    const [total, count] = avgCounter(...args);
    return total / count;
}

export const average = avg;
