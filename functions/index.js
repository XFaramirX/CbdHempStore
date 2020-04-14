const functions = require('firebase-functions');
const app = require('express')();
const { db } = require('./util/admin');
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

exports.createNotificationOnLike = functions.firestore
  .document('likes/{id}')
  .onCreate((snapshot) => {
    return db
      .doc(`/products/${snapshot.data().productId}`)
      .get()
      .then((doc) => {
        return db.doc(`/notifications/${snapshot.id}`).set({
          createdAt: new Date().toISOString(),
          recipient: doc.data().userHandle,
          sender: snapshot.data().userHandle,
          type: 'like',
          read: false,
          screamId: doc.id,
        });
      })
      .then(() => {
        console.log('Document successfully written!');
      })
      .catch((err) => console.error(err));
  });
