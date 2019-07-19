import { Cell } from '../../cell';
import { evaluateCell } from '../eval';

describe('eval', () => {
    describe('evaluateCell', () => {
        it('should set the value to a number if input can be parsed as a number', () => {
            let cell = new Cell('10');
            evaluateCell(cell);
            expect(cell.value).toBe(10);
            
            cell = new Cell('3.14');
            evaluateCell(cell);
            expect(cell.value).toBe(3.14);
        });
        it('should set the string value if input can be parsed to other formats', () => {
            let cell = new Cell('person');
            evaluateCell(cell);
            expect(cell.value).toBe('person');

            cell = new Cell('10.23p');
            evaluateCell(cell);
            expect(cell.value).toBe('10.23p');
        });
        it('should keep value is undefined if not defined', () => {
            const cell = new Cell();
            evaluateCell(cell);
            expect(cell.value).toBeUndefined();
        })
    });
});
