export function makeNumberReducer(fnName, reducer, initial) {
    return function fn(...arr) {
        return arr.reduce((cum, curr) => {
            if (typeof curr === 'number') {
                return reducer(cum, curr);
            }
            if (Array.isArray(curr)) {
                return fn(...curr);
            }
            throw new Error(`Invalid argument for ${fnName}: ${curr}`);
        }, initial);
    }
}
