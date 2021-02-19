//lib/firebase.ts
import * as firebase from 'firebase';
import 'firebase/firestore';
import 'firebase/auth'

const firebaseConfig = {
    apiKey: "AIzaSyCqHSpSCFodLJ1TCc6K8gKXQkpRgqs0FvA",
    authDomain: "chatexpo-24aa7.firebaseapp.com",
    projectId: "chatexpo-24aa7",
    storageBucket: "chatexpo-24aa7.appspot.com",
    messagingSenderId: "927638438614",
    appId: "1:927638438614:web:b2631d35b94fb074c0ff77"
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

export const getMessageDocRef = async () => {
    return await firebase.firestore().collection('rooms').doc().collection('messages').doc();
};


export const getUserId = async () => {
    const userCredential = await firebase.auth().signInAnonymously();
    return userCredential.user?.uid;
};