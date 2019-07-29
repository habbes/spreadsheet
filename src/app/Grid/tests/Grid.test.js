import React from 'react';
import { shallow } from 'enzyme';
import { Grid } from '../Grid';
import Cell from '../../Cell';

describe('Grid', () => {
    let rows;
    let cols;

    beforeEach(() => {
        rows = 4;
        cols = 2;
    });

    const render = () => shallow(<Grid rows={rows} cols={cols} />);

    it('should render column and row headers and rows * cols cells', () => {
        const component = render();
        expect(component.find(Cell).length).toBe(8);
        expect(component.find('.Grid--col-header').length).toBe(2);
        expect(component.find('.Grid--row-header').length).toBe(4);
    });

    it('should render grid with specified number of columns', () => {
        const component = render();
        const { style } = component.props();
        expect(style.gridTemplateColumns.includes('repeat(2'));
    });
});
