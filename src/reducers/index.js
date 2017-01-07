import {combineReducers} from 'redux';
import * as actions from '../actions';
import md5File from 'md5-file';
import fs from 'fs';
import request from 'request';
import {Promise} from 'es6-promise';

let loaded = {local: false, remote: false};

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

const fileListReducer = (state = {basePath: '', localFiles: [], remoteFiles: []}, action) => {
    switch (action.type) {
        case actions.LOCAL_FILE_LIST_COMPLETED:
            return {
                ...state,
                basePath: action.basePath,
                localFiles: action.files.map(function(file) {
                    let filePath = action.basePath + '/' + file;
                    if (fs.statSync(filePath).isDirectory()) {
                        return;
                    }

                    return {file: file, hash: md5File.sync(filePath)};
                }).filter(Boolean)
            };
        case actions.REMOTE_FILE_LIST_COMPLETED:
            return {
                ...state,
                remoteFiles: action.files
            };
    }

    return state;
};

const diffReducer = (state, action) => {
    if (action.type !== actions.LOCAL_FILE_LIST_COMPLETED && action.type !== actions.REMOTE_FILE_LIST_COMPLETED) {
        return state;
    }

    if (!loaded.local || !loaded.remote) {
        return state;
    }

    let diff = function(from, to) {
        return from.filter(x => !to.find(function(item) {
            return x.file === item.file && x.hash === item.hash;
        }));
    };

    // FIXME what happens if local or remote was removed?

    let toUpload = diff(state.files.localFiles, state.files.remoteFiles);
    let toDownload = diff(state.files.remoteFiles, state.files.localFiles);

    let auth = {
        baseUrl: 'http://cloud-storage.dev/api/storage',
        user: 'admin',
        category: 'files',
        token: 'ba2e8d1f54ed3e3d96935796576f1a06'
    };

    console.log(toUpload);
    console.log(toDownload);

    toUpload.map(function(item) {
        fs.createReadStream(state.files.basePath + '/' + item.file).pipe(
            request.put(auth.baseUrl + '/' + auth.user + '/' + auth.category + item.file + '?access_token=' + auth.token)
        );
    });

    return state;
};

let combinedReducers = combineReducers({
    history: historyReducer,
    files: fileListReducer
});

export default (state, action) => {
    state = combinedReducers(state, action);

    if (action.type === actions.LOCAL_FILE_LIST_COMPLETED) {
        loaded.local = true
    } else if (action.type === actions.REMOTE_FILE_LIST_COMPLETED) {
        loaded.remote = true;
    }

    return diffReducer(state, action);
};
