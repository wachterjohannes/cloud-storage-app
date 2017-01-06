import {combineReducers} from 'redux';
import * as actions from '../actions';

const historyReducer = (state = [], action) => {
    switch (action.type) {
        case actions.FILE_ADDED:
        case actions.FILE_UPDATED:
        case actions.FILE_REMOVED:
            return [
                ...state,
                {file: action.file, action: action.type}
            ];
        default:
            return state;
    }
};

export default combineReducers({
    history: historyReducer
});
