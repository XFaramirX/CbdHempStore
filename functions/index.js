const functions = require('firebase-functions');
const app = require('express')();

const { validateFirebaseIdToken } = require('./util/firebaseTokenValidate');

const {
  addProduct,
  getProduct,
  getAllProducts,
  addComment,
  likeProduct,
  unlikeProduct,
  deleteProduct,
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
app.get('/products', validateFirebaseIdToken, getAllProducts);
app.post('/product', validateFirebaseIdToken, addProduct);
app.get('/product/:productId', getProduct);
app.post('/product/:productId/comment', validateFirebaseIdToken, addComment);
app.post('/product/:productId/like', validateFirebaseIdToken, likeProduct);
app.post('/product/:productId/unlike', validateFirebaseIdToken, unlikeProduct);

app.delete('/product/:productId', validateFirebaseIdToken, deleteProduct);

//User Routes
app.post('/signup', signUp);
app.post('/signin', signIn);
app.get('/users', validateFirebaseIdToken, getAllUsers);
app.put('/user', validateFirebaseIdToken, updateUser);
app.get('/user', validateFirebaseIdToken, getAuthenticatedUser);
app.post('/user/image', validateFirebaseIdToken, uploadImage);

exports.api = functions.https.onRequest(app);
