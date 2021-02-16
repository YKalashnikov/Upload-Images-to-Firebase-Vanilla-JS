import {upload} from './upload.js';

upload('#file', {
    multiple: true,
    accept: ['.png', '.gif', '.bmp', 'jpeg', 'jpg'],
    onUpload(files) {
        console.log(files)
    }
})