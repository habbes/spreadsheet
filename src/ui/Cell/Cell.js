import React from 'react';
import { indexCoordToAlpha } from '../../core/grid';


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

  render() {
    const { row, col, onChange } = this.props;
    const id = indexCoordToAlpha([col, row]);
    return (
      <div className="Cell" title={id}>
        <input
          className="Cell-input"
          value={this.getValue()}
          onFocus={this.onFocus}
          onBlur={this.onBlur}
          onChange={(e) => onChange({
            input: e.target.value,
            coord: [col, row]
          })}
        />
      </div>
    );
  }
}

export default Cell;
