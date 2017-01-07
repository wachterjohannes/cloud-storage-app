import {take, put, call, fork} from 'redux-saga/effects';
import gaze from 'gaze';
import path from 'path';
import fetch from 'node-fetch';
import * as actions from '../actions';

function startWatcher(store) {
    let basePath = '/Users/johannes/Development/remotestorage/test-data';

    // Watch all .js files/dirs in process.cwd()
    gaze(basePath + '/**/*', function(err, watcher) {
        // Get all watched files
        let files = [].concat.apply([], Object.values(this.watched()));
        files = files.map(function(filePath) {
            return '/' + path.relative(basePath, filePath)
        });
        store.dispatch(actions.localFileListCompleted(files, basePath));

        // On file changed
        this.on('changed', function(filepath) {
            store.dispatch(actions.fileUpdated(filepath));

            console.log(filepath + ' was changed');
        });

        // On file added
        this.on('added', function(filepath) {
            store.dispatch(actions.fileAdded(filepath));

            console.log(filepath + ' was added');
        });

        // On file deleted
        this.on('deleted', function(filepath) {
            store.dispatch(actions.fileRemoved(filepath));

            console.log(filepath + ' was deleted');
        });
    });
}

function loadRemoteFileList(store) {
    let auth = {
        baseUrl: 'http://cloud-storage.dev/api/storage',
        user: 'admin',
        category: 'files',
        token: 'ba2e8d1f54ed3e3d96935796576f1a06'
    };

    fetchRemoteFolder('/', auth).then(files => store.dispatch(actions.remoteFileListCompleted(files)));
}

function fetchRemoteFolder(folder, auth) {
    return fetch(auth.baseUrl + '/' + auth.user + '/' + auth.category + folder + '?access_token=' + auth.token)
        .then(response => response.text())
        .then(response => JSON.parse(response))
        .then(response => Object.keys(response.items).map((index) => {
                // TODO recursive

                return {
                    file: folder + index,
                    hash: response.items[index]['Content-Hash'],
                    version: response.items[index]['ETag']
                };
            }
        ).filter(Boolean));
}

// TODO watch for changes on server

export default function* root() {
    const {store} = yield take('APP_INIT');
    yield startWatcher(store);
    yield fork(loadRemoteFileList, store);
}
