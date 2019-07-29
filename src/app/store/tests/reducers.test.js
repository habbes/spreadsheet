import { grid } from '../reducers';
import { updateCell } from '../actions';
import spreadsheet from '../../spreadsheet';

describe('grid reducer', () => {
    describe('update cell', () => {
        it('should set specified spreadsheet cell input and re-evaluate grid', () => {
            const expected = { matrix: { '0,1': '10' } };
            jest.spyOn(spreadsheet, 'setInput');
            jest.spyOn(spreadsheet, 'evaluate').mockReturnValue(expected)
            const action = updateCell({ coord: [0, 1], input: '10' });
            const result = grid({}, action);
            expect(result).toEqual(expected);
            expect(spreadsheet.setInput).toHaveBeenCalledWith([0, 1], '10');
            expect(spreadsheet.evaluate).toHaveBeenCalled();
        });
    });
});
