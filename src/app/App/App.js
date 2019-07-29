import React from 'react';
import Grid from '../Grid';
import './App.css';

const COLS = 26;
const ROWS = 50;

function App() {
    return (
        <div className="App">
            <Grid rows={ROWS} cols={COLS} />
        </div>
    );
}

export default App;
