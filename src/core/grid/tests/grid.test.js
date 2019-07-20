import { Grid } from '../grid';

describe('Grid', () => {
    /**
     * @type Grid
     */
    let grid;
    beforeEach(() => {
        grid = new Grid();
    });
    describe('setting and getting values', () => {
        it('should set value at specific index and retrieve the value', () => {
            grid.setAt([2, 3], 'test');
            const value = grid.getAt([2, 3]);
            expect(value).toBe('test');
        });
        describe('when getting value that was not previously set', () => {
            it('should return value with undefined input', () => {
                const value = grid.getAt([10, 15]);
                expect(value).toBeUndefined();
            });
        });
        describe('when setting a value that already has an input', () => {
            it('should overwrite existing input with new input', () => {
                grid.setAt([10, 11], 'test');
                grid.setAt([10, 11], 'test2');
                expect(grid.getAt([10, 11])).toBe('test2');
            });
        });
        describe('when setting a value input to null, undefined or empty string', () => {
            it('should remove the value', () => {
                grid.setAt([10, 11], 'test');
                grid.setAt([10, 11], '');
                expect(grid.getAt([10, 11])).toBeUndefined();
                expect('10,11' in grid.matrix).toBe(false);

                grid.setAt([10, 11], 'test');
                grid.setAt([10, 11], null);
                expect(grid.getAt([10, 11])).toBeUndefined();
                expect('10,11' in grid.matrix).toBe(false);

                grid.setAt([10, 11], 'test');
                grid.setAt([10, 11], undefined);
                expect(grid.getAt([10, 11])).toBeUndefined();
                expect('10,11' in grid.matrix).toBe(false);
            });
        });

        describe('getAt', () => {
            it('should return all the values from the specified coordinates', () => {
                grid.setAt([10, 20], 'a');
                grid.setAt([20, 21], 'b');
                const values = grid.getValues([[20, 21], [10, 20], [0, 2]]);
                expect(values).toEqual(['b', 'a', undefined]);
            });
        });

        describe('getCoordsInRange', () => {
            it('should return all coordinates in the specified inclusive row range', () => {
                const x1 = 2, y1 = 10,
                    x2 = 5, y2 = 10;
                const coords = grid.getCoordsInRange([x1, y1], [x2, y2]);
                expect(coords).toEqual([
                    [2, 10], [3, 10], [4, 10], [5, 10]
                ]);
            });
            it('should return all coordinates in the specified inclusive column range', () => {
                const x1 = 20, y1 = 40,
                    x2 = 20, y2 = 43;
                const coords = grid.getCoordsInRange([x1, y1], [x2, y2]);
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
                const coords = grid.getCoordsInRange([x1, y1], [x2, y2]);
                expect(coords).toEqual([
                    [18, 40], [19, 40], [20, 40],
                    [18, 41], [19, 41], [20, 41],
                    [18, 42], [19, 42], [20, 42],
                    [18, 43], [19, 43], [20, 43],
                ]);
            });
        });

        describe('getValuesInRange', () => {
            it('should return all the values in the specified range', () => {
                const x1 = 1, y1 = 2, x2 = 3, y2 = 4;
                const values = ['a', 'b'];
                jest.spyOn(grid, 'getCoordsInRange').mockReturnValue([[x1, y1], [x2, y2]]);
                jest.spyOn(grid, 'getValues').mockReturnValue(values);
                const res = grid.getValuesInRange([x1, y1], [x2, y2]);
                expect(grid.getCoordsInRange).toHaveBeenCalledWith([1, 2], [3, 4]);
                expect(grid.getValues).toHaveBeenCalledWith([[1, 2], [3, 4]]);
                expect(res).toEqual(values);
            });
        });

        describe('getCoordsWithInputs', () => {
            it('should return the coords of all the values with inputs', () => {
                grid.setAt([0, 10], 'test');
                grid.setAt([10, 11], '20');
                grid.setAt([2, 10], '=sum(1, 2)');
                const coords = grid.getCoordsWithValues();
                expect(coords).toEqual([[0, 10], [10, 11], [2, 10]]);
            });
        });
    });
});
