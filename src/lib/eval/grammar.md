# Spreadsheet formula grammar

## Lexical elements

SUM(A3:B3, 1, 2 "ser", AVG(3, 5, A3:A4))

**symbol**: 
- `:`
- `(`
- `)`
- `-`

**numberLiteral**: `-`?[`0-9`]+(`.` `[0-9]`+)?

**stringLiteral**: a sequence of characters enclosed in `"` (excluding `"`)

**cellLiteral**: `[a-z]+\d+`

**identifier**: `[a-zA-Z]+`

## Program structure

**range**: `cellLiteral` `:` `cellLiteral`

**term**: `cellLiteral` | `numberLiteral` | `stringLiteral` | `range`

**functionCall**: `identifier` ( `expression`, (`, expression`)* )

**expression**: `term` | `functionCall` | `-expression`


**formula**: `expression`