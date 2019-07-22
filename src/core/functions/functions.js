export function sum(...args) {
    return args.reduce((total, item) => {
        if (typeof item === 'number') {
            return total + item;
        }
        if (Array.isArray(item)) {
            return total + sum(...item);
        }
        throw new Error(`Invalid argument for SUM: ${item}`);
    }, 0);
}

export function avg(...args) {
    const [total, count] = args.reduce(([total, count], item) => {
        if (typeof item === 'number') {
            return [total + item, count + 1];
        }
        if (Array.isArray(item)) {
            return [total + sum(...item), count + item.length];
        }
        throw new Error(`Invalid argument for AVG: ${item}`);
    }, [0, 0]);
    return total / count;
}
