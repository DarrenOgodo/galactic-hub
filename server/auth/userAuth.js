// initialising firebase with functions from firebase SDK
const { initializeApp } = require('firebase/app');

// Authentication methods 
const { 
    getAuth,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword
} = require('firebase/auth');

// firestore methods 
const { 
    getFirestore,
    doc,
    setDoc,
    getDoc,
    updateDoc,
    collection 
} = require('firebase/firestore');

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

// firestore setup 
const db = getFirestore(firebaseApp);
const User = collection(db, "Users");

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

        await setDoc(doc(User, userCred.user.uid), {
            fname,
            lname,
            dob,
            email
        })
        return userCred.user;
    } catch (error) {
        throw new Error(error.message);
    }
}

// get user from firestore using auth 
const getUser = async(uid) => {
    
    try {
        if(uid){
            const snapshot = await getDoc(doc(db, "Users", uid));
            
            if (snapshot.exists()) {
                return snapshot.data();
            }else{
                console.log(`No user data with id ${uid} found`); 
            }
        }else{
            return null;
        }
    } catch (error) {
        throw new Error(error.message);
    }
}

// update user firestore details 
const updateUser = async(uid, updatedData) => {

    try {
        if(uid && updatedData){
            const userRef = doc(db, "Users", uid);

            // update individual user details with new user details.
            // ignores email for auth reasons
            await updateDoc(userRef, {
                fname: updatedData.fname,
                lname: updatedData.lname,
                dob: updatedData.dob
            });

        }else{
            return null;
        }    
    } catch (error) {
        throw new Error(error.message);
    }
}

module.exports = { loginUser, createUser, getUser, updateUser };