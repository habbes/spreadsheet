
const LETTERS_TO_INDEX = {
    a: 0, b: 1, c: 2, d: 3, e: 4, f: 5, g: 6, h: 7, i: 8, j: 9, k: 10, l: 11, m: 12,
    n: 13, o: 14, p: 15, q: 16, r: 17, s: 18, t: 19, u: 20, v: 21, w: 22, x: 23, y: 24, z: 25
};

const LETTERS = [
    'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm',
    'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'
];

export function alphaToIndexCoord (alphaIndex) {
    const [letterPart] = alphaIndex.split(/\d+/);
    const numberPart = alphaIndex.slice(letterPart.length);
    const x = LETTERS_TO_INDEX[letterPart.toLowerCase()];
    const y = Number(numberPart) - 1;
    return [x, y];
}

export function indexCoordToAlpha ([x, y]) {
    const letterPart = LETTERS[x].toUpperCase();
    const numberPart = y + 1;
    return `${letterPart}${numberPart}`;
}

export function numberToLetterFormat (num) {
    return LETTERS[num].toUpperCase();
}

export function getCoordsInRange ([x1, y1], [x2, y2]) {
    const coords = [];
    for (let y = y1; y <= y2; y++) {
        for (let x = x1; x <= x2; x++) {
            coords.push([x, y]);
        }
    }
    return coords;
}
