import React from 'react';
import Grid from '../Grid';
import Header from './Header';
import './App.css';

const COLS = 26;
const ROWS = 50;

function App() {
    return (
        <div className="App">
            <Header />
            <Grid rows={ROWS} cols={COLS} />
        </div>
    );
}

export default App;
