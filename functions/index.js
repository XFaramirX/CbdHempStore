const functions = require('firebase-functions');
const app = require('express')();

const { validateFirebaseIdToken } = require('./util/firebaseTokenValidate');

const {
  addProduct,
  getProduct,
  getAllProducts,
  addComment,
} = require('./handlers/products');
const {
  signUp,
  signIn,
  getAllUsers,
  uploadImage,
  updateUser,
  getAuthenticatedUser,
} = require('./handlers/users');

//Product Routes

app.post('/product', validateFirebaseIdToken, addProduct);
app.get('/product/:productId', getProduct);
app.post('/product/:productId/comment', validateFirebaseIdToken, addComment);
app.get('/products', validateFirebaseIdToken, getAllProducts);

//User Routes
app.post('/signup', signUp);
app.post('/signin', signIn);
app.put('/user', validateFirebaseIdToken, updateUser);
app.get('/user', validateFirebaseIdToken, getAuthenticatedUser);
app.get('/users', validateFirebaseIdToken, getAllUsers);
app.post('/user/image', validateFirebaseIdToken, uploadImage);

exports.api = functions.https.onRequest(app);
