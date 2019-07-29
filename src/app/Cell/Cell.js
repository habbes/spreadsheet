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
    if (!cell) {
      return '';
    }
    return this.state.editing ? cell.input : cell.value;
  }

  getClass () {
    return `Cell ${this.state.editing ? 'Cell__editing' : ''}`;
  }

  render() {
    const { row, col, updateCell } = this.props;
    const id = indexCoordToAlpha([col, row]);
    return (
      <div className={this.getClass()} title={id}>
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
