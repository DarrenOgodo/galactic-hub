// initialising firebase with functions from firebase SDK
const { firebase, initializeApp } = require('firebase/compat/app');
const { 
    getAuth,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword
} = require('firebase/auth');
require('firebase/compat/firestore');
const firebaseConfig = require('../config/FirebaseConfig.js');

// using config variables for init of auth server
const firebaseApp = initializeApp({
    apiKey,
    authDomain,
    projectId,
    storageBucket,
    messagingSenderId,
    appId,
    measurementId
} = firebaseConfig);

// instantiate firestore db for user data
const db = firebaseApp.firestore();
const User = db.collection('Users');

const auth = getAuth(firebaseApp);

// user login using firebase authentication
const loginUser = async(email,password) => {
    try {
        const userCred = await signInWithEmailAndPassword(auth, email, password);
        return userCred.user;
    } catch (error) {
        throw new Error(error.message);
    }
}

// create user using firebase authentication
const createUser = async(user) => {
    try {
        const {fname, lname, dob, email, password} = user;
        const userCred = await createUserWithEmailAndPassword(auth, email, password);
        const userDoc = await User.doc(userCred.user.uid).set({
            fname,
            lname,
            dob,
            email
        });
        return userCred.user;
    } catch (error) {
        throw new Error(error.message);
    }
}

module.exports = { loginUser, createUser };