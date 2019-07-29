import React from 'react';
import { shallow } from 'enzyme';
import Cell from '../Cell';

describe('Cell', () => {
    let state;

    beforeEach(() => {
        state = {
            grid: {
                getAt: jest.fn()
            }
        };
    });

    const getProps = () => ({
        store: {
            getState() {
                return state;
            }
        }
    })

    const render = () => shallow(<Cell {...getProps()} />);

    it('should render cell with input field', () => {
        const component = render();
        expect(component.find('input').hasClass('Cell--input')).toBe(true);
    });
});
