import React from 'react';

const Header = () => (
    <header className="Header">
        <div className="Header--left">
            <div className="logo">Quicksheets</div>
        </div>
        <div className="Header--right">
            <div>
                <a
                    href="https://github.com/habbes/spreadsheet/blob/masterfunctions.md"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Available functions
                </a>
            </div>
            <div>
                <a
                    href="https://github.com/habbes/spreadsheet"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Source code
                </a>
            </div>
        </div>
    </header>
);

export default Header;