# Spreadsheet formula grammar

## Lexical elements

- `symbol` 
    - `':'`
    - `','`
    - `'('`
    - `')'`
    - `'-'`
    - `'+'`
    - `'/'`
    - `'*'`
- `numberLiteral`
    - `-?[0-9]+(.[0-9]+)?`
- `stringLiteral`
    - a sequence of characters enclosed in `"` (excluding `"`)
- `cellLiteral`
    - `[a-zA-Z]+\d+`
- `identifier`
    - `[a-zA-Z]+`


## Program structure

- `cellRange`
    - `cellLiteral ':' cellLiteral`
- `term`
    - `cellLiteral`
    - `numberLiteral`
    - `stringLiteral`
    - `cellRange`
- `functionArgs`
    - `expression`
    - `expression ',' functionArgs`

- `functionCall`
    - `identifier '(' ')'`
    - `identifier '(' functionArgs ')'`
- `expression`
    - `term`
    - `functionCall`
    - `'-' expression`
    - `'(' expression ')'`
    - `expression '+' expression`
    - `expression '-' expression`
    - `expression '*' expression`
    - `expression '/' expression`

- `formula` 
    - `expression`


## Examples of valid formulae:

- `10.5`
- `-A3`
- `SUM(A3:A5, 100, B10 + AVG(C3:E3) / 20)`

**Note**: To enter a formula in the spreadsheet, you have to prefix it with the equals sign: `=`. e.g `=SUM(A1:10)`
