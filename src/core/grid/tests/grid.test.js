import { Grid } from '../grid';

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
        })
    });
});
