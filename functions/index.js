const functions = require('firebase-functions');
const app = require('express')();

const { validateFirebaseIdToken } = require('./util/firebaseTokenValidate');

const { getProducts, addProduct } = require('./handlers/products');
const {
  signUp,
  signIn,
  getUsers,
  uploadImage,
  updateUser,
} = require('./handlers/users');

//Product Routes
app.get('/products', validateFirebaseIdToken, getProducts);
app.post('/product', validateFirebaseIdToken, addProduct);

//User Routes
app.post('/signup', signUp);
app.post('/signin', signIn);
app.get('/users', validateFirebaseIdToken, getUsers);
app.get('/users', validateFirebaseIdToken, getUsers);
app.put('/updateUser', validateFirebaseIdToken, updateUser);
app.post('/user/image', validateFirebaseIdToken, uploadImage);

exports.api = functions.https.onRequest(app);
