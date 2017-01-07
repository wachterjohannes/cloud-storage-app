import {take, put, call, fork} from 'redux-saga/effects';
import gaze from 'gaze';
import * as actions from '../actions';

function startWatcher(store) {
    let path = '/Users/johannes/Development/remotestorage/test-data';

    // Watch all .js files/dirs in process.cwd()
    gaze(path + '/**/*', function(err, watcher) {
        // Get all watched files
        let files = [].concat.apply([], Object.values(this.watched()));
        store.dispatch(actions.localFileListCompleted(files));

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

export default function* root() {
    const {store} = yield take('APP_INIT');
    yield startWatcher(store);
}
