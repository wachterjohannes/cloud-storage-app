import {take, put, call, fork} from 'redux-saga/effects';

function startWatcher() {
    let path = '/Users/johannes/Development/remotestorage/test-data';
}

export default function* root() {
    const {store} = yield take('APP_INIT');
    yield startWatcher(store.getState);
}
