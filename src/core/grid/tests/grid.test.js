import { Grid } from '../grid';
import { Cell } from '../../cell';

describe('Grid', () => {
    /**
     * @type Grid
     */
    let grid;
    beforeEach(() => {
        grid = new Grid();
    });
    describe('setting and getting cells', () => {
        it('should set input at specific index and retrieve the cell with the input', () => {
            grid.setCellInput(2, 3, 'test');
            const cell = grid.getCellAt(2, 3);
            expect(cell.input).toBe('test');
        });
        describe('when getting cell that was not previously set', () => {
            it('should return cell with undefined input', () => {
                const cell = grid.getCellAt(10, 15);
                expect(cell.input).toBeUndefined();
            });
        });
        describe('when setting a cell that already has an input', () => {
            it('should overwrite existing input with new input', () => {
                grid.setCellInput(10, 11, 'test');
                grid.setCellInput(10, 11, 'test2');
                expect(grid.getCellAt(10, 11).input).toBe('test2');
            });
        });
        describe('when setting a cell input to null, undefined or empty string', () => {
            it('should remove the cell', () => {
                grid.setCellInput(10, 11, 'test');
                grid.setCellInput(10, 11, '');
                expect(grid.getCellAt(10, 11).input).toBeUndefined();
                expect('10,11' in grid.matrix).toBe(false);

                grid.setCellInput(10, 11, 'test');
                grid.setCellInput(10, 11, null);
                expect(grid.getCellAt(10, 11).input).toBeUndefined();
                expect('10,11' in grid.matrix).toBe(false);

                grid.setCellInput(10, 11, 'test');
                grid.setCellInput(10, 11, undefined);
                expect(grid.getCellAt(10, 11).input).toBeUndefined();
                expect('10,11' in grid.matrix).toBe(false);
            });
        });

        describe('getCells', () => {
            it('should return all the cells from the specified coordinates', () => {
                grid.setCellInput(10, 20, 'a');
                grid.setCellInput(20, 21, 'b');
                const cells = grid.getCells([[20, 21], [10, 20], [0, 2]]);
                expect(cells.map(cell => cell.input)).toEqual(['b', 'a', undefined]);
            });
        });

        describe('getCoordsInRange', () => {
            it('should return all coordinates in the specified inclusive row range', () => {
                const x1 = 2, y1 = 10,
                    x2 = 5, y2 = 10;
                const coords = grid.getCoordsInRange(x1, y1, x2, y2);
                expect(coords).toEqual([
                    [2, 10], [3, 10], [4, 10], [5, 10]
                ]);
            });
            it('should return all coordinates in the specified inclusive column range', () => {
                const x1 = 20, y1 = 40,
                    x2 = 20, y2 = 43;
                const coords = grid.getCoordsInRange(x1, y1, x2, y2);
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
                const coords = grid.getCoordsInRange(x1, y1, x2, y2);
                expect(coords).toEqual([
                    [18, 40], [19, 40], [20, 40],
                    [18, 41], [19, 41], [20, 41],
                    [18, 42], [19, 42], [20, 42],
                    [18, 43], [19, 43], [20, 43],
                ]);
            });
        });

        describe('getCellsInRange', () => {
            it('should return all the cells in the specified range', () => {
                const x1 = 1, y1 = 2, x2 = 3, y2 = 4;
                const cells = [new Cell('a'), new Cell('b')];
                jest.spyOn(grid, 'getCoordsInRange').mockReturnValue([[x1, y1], [x2, y2]]);
                jest.spyOn(grid, 'getCells').mockReturnValue(cells);
                const res = grid.getCellsInRange(x1, y1, x2, y2);
                expect(grid.getCoordsInRange).toHaveBeenCalledWith(1, 2, 3, 4);
                expect(grid.getCells).toHaveBeenCalledWith([[1, 2], [3, 4]]);
                expect(res).toEqual(cells);
            });
        });

        describe('getCoordsWithInputs', () => {
            it('should return the coords of all the cells with inputs', () => {
                grid.setCellInput(0, 10, 'test');
                grid.setCellInput(10, 11, '20');
                grid.setCellInput(2, 10, '=sum(1, 2)');
                const coords = grid.getCoordsWithInputs();
                expect(coords).toEqual([[0, 10], [10, 11], [2, 10]]);
            });
        });
    });
});
