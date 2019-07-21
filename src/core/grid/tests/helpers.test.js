import { alphaToIndexCoord, getCoordsInRange } from '../helpers';

describe('alphaToIndexCoord', () => {
    it('should convert alphanumeric cell coord to numerical indices', () => {
        expect(alphaToIndexCoord('A1')).toEqual([0, 0]);
        expect(alphaToIndexCoord('A2')).toEqual([0, 1]);
        expect(alphaToIndexCoord('B3')).toEqual([1, 2]);
        expect(alphaToIndexCoord('Z50')).toEqual([25, 49]);
    });

    it('should NOT be case sensitive', () => {
        expect(alphaToIndexCoord('b3')).toEqual([1, 2]);
    });
});

describe('getCoordsInRange', () => {
    it('should return all coordinates in the specified inclusive row range', () => {
        const x1 = 2, y1 = 10,
            x2 = 5, y2 = 10;
        const coords = getCoordsInRange([x1, y1], [x2, y2]);
        expect(coords).toEqual([
            [2, 10], [3, 10], [4, 10], [5, 10]
        ]);
    });
    it('should return all coordinates in the specified inclusive column range', () => {
        const x1 = 20, y1 = 40,
            x2 = 20, y2 = 43;
        const coords = getCoordsInRange([x1, y1], [x2, y2]);
        expect(coords).toEqual([
            [20, 40],
            [20, 41],
            [20, 42],
            [20, 43]
        ]);
    });
    it('should return all coordinates in the specified box range', () => {
        const x1 = 18, y1 = 40,
            x2 = 20, y2 = 43;
        const coords = getCoordsInRange([x1, y1], [x2, y2]);
        expect(coords).toEqual([
            [18, 40], [19, 40], [20, 40],
            [18, 41], [19, 41], [20, 41],
            [18, 42], [19, 42], [20, 42],
            [18, 43], [19, 43], [20, 43],
        ]);
    });
});
