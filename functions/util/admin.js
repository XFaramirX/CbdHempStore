const admin = require('firebase-admin');
const functions = require('firebase-functions');

const serviceAccount = require('../../serviceAccount.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://cbhempstore-staging.firebaseio.com',
  functions: functions.config().firebase,
});

const db = admin.firestore();

module.exports = { admin, db };
