const functions = require('firebase-functions');
const express = require('express');
const app = express();

const { validateFirebaseIdToken } = require('./util/firebaseTokenValidate');

const { getProducts, addProduct } = require('./handlers/products');
const { signUp, signIn, getUsers } = require('./handlers/users');

app.get('/products', validateFirebaseIdToken, getProducts);

app.post('/product', validateFirebaseIdToken, addProduct);

app.post('/signup', signUp);

app.post('/signin', signIn);

app.get('/users', validateFirebaseIdToken, getUsers);

exports.api = functions.https.onRequest(app);
