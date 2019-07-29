import React from 'react';
import { connect } from 'react-redux';
import { indexCoordToAlpha } from '../../lib';
import { updateCell } from '../store/actions';

import './Cell.css';

export class Cell extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
        editing: false
        };

        this.onBlur = this.onBlur.bind(this);
        this.onFocus = this.onFocus.bind(this);
    }

    onBlur() {
        this.setState({ editing: false });
    }

    onFocus() {
        this.setState({ editing: true });
    }

    getValue () {
        const { cell } = this.props;
        const { editing } = this.state;
        if (!cell) {
            return '';
        }
        if (editing) {
            return cell.input;
        }
        if (cell.error) {
            return '##ERROR';
        }
        return cell.value;
    }

    getTitle () {
        const { cell, row, col } = this.props;
        return cell && cell.error ? `Error: ${cell.error}` : indexCoordToAlpha([col, row]);
    }

    getClass () {
        const { editing } = this.state;
        const { cell } = this.props;
        const error = !!(cell && cell.error);
        return `Cell ${editing ? 'Cell__editing' : ''} ${error ? 'Cell__error' : ''}`;
    }

    render() {
        const { row, col, updateCell } = this.props;

        return (
            <div className={this.getClass()} title={this.getTitle()}>
                <input
                    className="Cell--input"
                    value={this.getValue()}
                    onFocus={this.onFocus}
                    onBlur={this.onBlur}
                    onChange={(e) => updateCell({
                        input: e.target.value,
                        coord: [col, row]
                    })}
                />
            </div>
        );
    }
}

const mapStateToProps = ({ grid }, { row, col }) => ({
    cell: grid.getAt([col, row])
});

const mapDispatchToProps = { updateCell };

export default connect(mapStateToProps, mapDispatchToProps)(Cell);
