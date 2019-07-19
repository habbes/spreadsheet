import { Cell } from "../cell";

/**
 * 
 * @param {Cell} cell 
 */
export function evaluateCell(cell) {
    const { input } = cell;
    if (input) {
        if (isNumber(input)) {
            cell.value = Number(input);
        }
        else {
            cell.value = input;
        }
    }
    return cell;
}

function isNumber(a) {
    return !isNaN(Number(a))
}