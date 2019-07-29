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
    });

    it('should display computed values and update them when source values change', () => {
        cy.get('[data-cell=A8] input').should('have.value', '=SUM(A2:A5)');

        cy.get('[data-cell=A8] input').blur();
        cy.get('[data-cell=A8] input').should('have.value', '130');

        cy.get('[data-cell=A2] input').clear().type('100');
        cy.get('[data-cell=A8] input').should('have.value', '220');
    });

    describe('When a cell has errors', () => {
        it('should display ##ERROR if the cell is out of focus and error message in tooltip', () => {
            cy.get('[data-cell=A2] input').clear().type('test');
            cy.get('[data-cell=A8] input').should('have.value', '##ERROR');
        });
    });
});