const firebase = require('firebase');

const firebaseConfig = {
  apiKey: 'AIzaSyBEBFimeOHkFmdUbqb9tTP3VaFsOLRJ-yM',
  authDomain: 'cbhempstore-staging.firebaseapp.com',
  databaseURL: 'https://cbhempstore-staging.firebaseio.com',
  projectId: 'cbhempstore-staging',
  storageBucket: 'cbhempstore-staging.appspot.com',
  messagingSenderId: '674326983182',
  appId: '1:674326983182:web:f875ee042d940a3edec25f',
  measurementId: 'G-9XQZ2HPMXD',
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

module.exports = { firebase };
