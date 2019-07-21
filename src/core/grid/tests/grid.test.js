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
