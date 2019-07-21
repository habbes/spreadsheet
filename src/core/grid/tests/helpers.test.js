import { alphaToIndexCoord } from '../helpers';

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
