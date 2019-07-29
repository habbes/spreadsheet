/**
 * creates a generic reducer that flattens its arguments
 * @param {Function} reducer 
 * @param {any} initial 
 */
export function makeFlatteningReducer(reducer, initial) {
    return function fn(...arr) {
        return arr.reduce((cum, curr) => {
            if (Array.isArray(curr)) {
                return fn(...curr);
            }
            return reducer(cum, curr);
        }, initial);
    }
}

/**
 * creates a flattening reducer that throws an error if any
 * of the arguments is not a number
 * @param {String} fnName 
 * @param {Function} reducer 
 * @param {any} initial 
 */
export function makeFlatteningNumberReducer(fnName, reducer, initial) {
    const numberReducer = (a, b) => {
        if (typeof b !== 'number') {
            throw new Error(`Invalid argument for ${fnName}: ${b}`);
        }
        return reducer(a, b);
    };
    return makeFlatteningReducer(numberReducer, initial);
}
