import {combineReducers} from 'redux';
import * as actions from '../actions';
import md5File from 'md5-file';
import fs from 'fs';

const historyReducer = (state = [], action) => {
    switch (action.type) {
        case actions.FILE_ADDED:
        case actions.FILE_UPDATED:
        case actions.FILE_REMOVED:
            return [
                ...state,
                {file: action.file, action: action.type}
            ];
    }

    return state;
};

const localFileListReducer = (state = [], action) => {
    switch (action.type) {
        case actions.LOCAL_FILE_LIST_COMPLETED:
            return  action.files.map(function(file) {
                if (fs.statSync(file).isDirectory()) {
                    return;
                }

                return {file: file, hash: md5File.sync(file)};
            }).filter(Boolean);
    }

    return state;
};

export default combineReducers({
    history: historyReducer,
    files: localFileListReducer
});
