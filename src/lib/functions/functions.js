import { makeFlatteningNumberReducer, makeFlatteningReducer, makeNumberFunction } from './helpers';

export const abs = makeNumberFunction('ABS', a => Math.abs(a));

const avgCounter = makeFlatteningNumberReducer('AVERAGE', ([total, count], curr) => [total + curr, count + 1], [0, 0]);
export function average (...args) {
    const [total, count] = avgCounter(...args);
    return total / count;
}

export const avg = average;

export const count = makeFlatteningReducer(a => a + 1, 0);

export const power = makeNumberFunction('POWER', (a, b) => Math.pow(a, b));

export const pow = power;

export const product = makeFlatteningNumberReducer('PRODUCT', (a, b) => a * b, 1);

export const sum = makeFlatteningNumberReducer('SUM', (a, b) => a + b, 0);

export const sqrt = makeNumberFunction('SQRT', a => Math.sqrt(a));

