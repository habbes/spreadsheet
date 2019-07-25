import * as functions from '../functions';
import { Cell } from '../cell';
import { Spreadsheet } from '../spreadsheet';

describe('Spreadsheet', () => {
    let spreadsheet;
    beforeEach(() => {
        spreadsheet = new Spreadsheet(functions);
    })

    it('should parse inputs and return output grid with evaluated cells', () => {
        // set A1:A5 to 0, 5, 10, 15, 20
        for (let i = 0; i < 5; i++) {
            spreadsheet.setInput([0, i], String(i * 5));
        }

        // set B1 to AVG(A1:A5)
        spreadsheet.setInput([1, 0], '=AVG(A1:A5)');

        // set B2 to 100
        spreadsheet.setInput([1, 1], '100');
        
        // set C5 to SUM(B1:B2, 200);
        spreadsheet.setInput([2, 4], '=SUM(B1:B2, 200)');

        const outGrid = spreadsheet.evaluate();

        // A1:A5 == 0, 5, 10, 15, 20
        for (let i = 0; i < 5; i++) {
            expect(outGrid.getAt([0, i])).toEqual(new Cell(String(i * 5), i * 5));
        }

        // B1 == 10
        expect(outGrid.getAt([1, 0])).toEqual(new Cell('=AVG(A1:A5)', 10));
        // B2 == 20
        expect(outGrid.getAt([1, 1])).toEqual(new Cell('100', 100));
        // C5 == 310
        expect(outGrid.getAt([2, 4])).toEqual(new Cell('=SUM(B1:B2, 200)', 310));
    });

    it('should set errors correctly', () => {
        spreadsheet.setInput([0, 0], 'test');
        spreadsheet.setInput([0, 1], '=SUM(A1)');
        spreadsheet.setInput([0, 2], '=A2')

        const outGrid = spreadsheet.evaluate();

        expect(outGrid.getAt([0, 0])).toEqual(new Cell('test', 'test'));
        expect(outGrid.getAt([0, 1])).toEqual(new Cell('=SUM(A1)', undefined, 'Invalid argument for SUM: test'));
        expect(outGrid.getAt([0, 2])).toEqual(new Cell('=A2', undefined, 'Error found in dependent cell \'A2\''));
    });
});
