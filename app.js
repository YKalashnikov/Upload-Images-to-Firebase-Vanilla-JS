import {
    upload
} from './upload.js';

import dotenv from 'dotenv';


import firebase from 'firebase/app'
import 'firebase/storage';

dotenv.config()

const firebaseConfig = {
    apiKey: process.env.apiKey,
    authDomain: process.env.authDomain,
    projectId: process.env.projectId,
    storageBucket: process.env.storageBucket,
    messagingSenderId: process.env.messagingSenderId,
    appId: process.env.appId
};

firebase.initializeApp(firebaseConfig);

const storage = firebase.storage()


upload('#file', {
    multiple: true,
    accept: ['.png', '.gif', '.bmp', 'jpeg', 'jpg'],
    onUpload(files, blocks) {
        files.forEach((file, index) => {
            const ref = storage.ref(`images/${file.name}`)
            const task = ref.put(file)
            task.on('state_changes', snapshot => {
                const percentage = ((snapshot.bytesTransferred / snapshot.totalBytes) * 100).toFixed(0) + '%';
                const block = blocks[index].querySelector('.preview-info-progress')
                block.textContent = percentage
                block.style.width = percentage
            }, error => {
                console.log(error)
            }, () => {
                task.snapshot.ref.getDownloadURL().then(url => {
                    console.log('URL', url)
                })
            })
        })
    }
})