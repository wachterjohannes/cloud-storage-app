export const LOCAL_FILE_LIST_COMPLETED = 'LOCAL_FILE_LIST_COMPLETED';
export const REMOTE_FILE_LIST_COMPLETED = 'REMOTE_FILE_LIST_COMPLETED';

export const FILE_ADDED = 'FILE_ADDED';
export const FILE_UPDATED = 'FILE_UPDATED';
export const FILE_REMOVED = 'FILE_REMOVED';

export function remoteFileListCompleted(files) {
    return {
        type: REMOTE_FILE_LIST_COMPLETED,
        files
    };
}

export function localFileListCompleted(files, basePath) {
    return {
        type: LOCAL_FILE_LIST_COMPLETED,
        files,
        basePath
    }
}

export function fileAdded(file) {
    return {
        type: FILE_ADDED,
        file
    };
}

export function fileUpdated(file) {
    return {
        type: FILE_UPDATED,
        file
    };
}

export function fileRemoved(file) {
    return {
        type: FILE_REMOVED,
        file
    };
}
