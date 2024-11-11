// Import the functions you need from the SDKs you need
const { initializeApp } = require('firebase/app');
require('firebase/compat/firestore');
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC5_xFkp3DMb45yGdGP2a5uGzbJb3DFjcQ",
  authDomain: "galactic-hub-505c5.firebaseapp.com",
  projectId: "galactic-hub-505c5",
  storageBucket: "galactic-hub-505c5.appspot.com",
  messagingSenderId: "455949094788",
  appId: "1:455949094788:web:68c36cc3ac0b2f2c2917d1",
  measurementId: "G-E9KG67WP3Q"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
// instantiate firestore db for user data
const db = firebaseApp.firestore();
const User = db.collection('Users');

const auth = getAuth(firebaseApp);

module.exports = { User, auth };
