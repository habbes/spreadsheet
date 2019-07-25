import * as types from './action-types';

export function updateCell(update) {
    return {
        type: types.UPDATE_CELL,
        update
    };
}
