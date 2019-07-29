describe('Spreadsheet', () => {
    beforeEach(() => {
        cy.visit('/')
            .get('[data-cell=A1] input').type('Data');
        
        const data = [10, 30, 40, 50];
        data.forEach((d, index)  => {
            cy.get(`[data-cell=A${index + 2}] input`).type(d);
        });

        cy.get(`[data-cell=A7] input`).type('Total');
        cy.get(`[data-cell=A8] input`).type('=SUM(A2:A5)');

        cy.get(`[data-cell=B1] input`).type('=AVG(A8 + 10, 100, 300)');
    });

    it('should display computed values and update them when source values change', () => {
        // displays formula when cell is in focus
        cy.get('[data-cell=A8] input').click();
        cy.get('[data-cell=A8] input').should('have.value', '=SUM(A2:A5)');

        // display computed value when cell is blurred
        cy.get('[data-cell=A8] input').blur();
        cy.get('[data-cell=A8] input').should('have.value', '130');
    
        cy.get('[data-cell=B1] input').should('have.value', '180');

        // update computed values when source inputs are updated
        cy.get('[data-cell=A2] input').clear().type('100');
        cy.get('[data-cell=A8] input').should('have.value', '220');
        cy.get('[data-cell=B1] input').should('have.value', '210');
    });

    describe('When a cell has errors', () => {
        it('should display ##ERROR if the cell is out of focus and error message in tooltip', () => {
            cy.get('[data-cell=A2] input').clear().type('test');

            // display ##ERROR when cells with error are out of focus
            cy.get('[data-cell=A8] input').should('have.value', '##ERROR');
            cy.get('[data-cell=A8]').should(($cell) => {
                expect($cell.attr('title')).to.match(/Invalid argument for SUM: test/i);
            });

            cy.get('[data-cell=B1] input').should('have.value', '##ERROR');
            cy.get('[data-cell=B1]').should(($cell) => {
                expect($cell.attr('title')).to.match(/Error found in dependent cell 'A8'/i);
            });

            // display formula when cell with error is on focus
            cy.get('[data-cell=A8] input').click();
            cy.get('[data-cell=A8] input').should('have.value', '=SUM(A2:A5)');

            // should clear error when error source is corrected
            cy.get('[data-cell=A2] input').clear().type('10');
            cy.get('[data-cell=A8] input').should('have.value', '130');
            cy.get('[data-cell=B1] input').should('have.value', '180');
        });
    });
});
