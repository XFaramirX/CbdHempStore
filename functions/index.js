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
  getUserDetails,
  markNotificationsRead,
  getNotifications, 
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
app.get('/user/:handle', getUserDetails);

app.get('/notifications', validateFirebaseIdToken, getNotifications);
app.post('/notifications', validateFirebaseIdToken, markNotificationsRead);

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
          productId: doc.id,
        });
      })
      .then(() => {
        console.log('Document OnLike successfully written!');
      })
      .catch((err) => console.error(err));
  });

exports.deleteNotificationOnUnLike = functions.firestore
  .document('likes/{id}')
  .onDelete((snapshot) => {
    return db
      .doc(`/notifications/${snapshot.id}`)
      .delete()
      .catch((err) => {
        console.error(err);
        return;
      });
  });

exports.createNotificationOnComment = functions.firestore
  .document('comments/{id}')
  .onCreate((snapshot) => {
    return db
      .doc(`/products/${snapshot.data().productId}`)
      .get()
      .then((doc) => {
        return db.doc(`/notifications/${snapshot.id}`).set({
          createdAt: new Date().toISOString(),
          recipient: doc.data().userHandle,
          sender: snapshot.data().userHandle,
          type: 'comment',
          read: false,
          productId: doc.id,
        });
      })
      .then(() => {
        console.log('Document OnComment successfully written!');
      })
      .catch((err) => console.error(err));
  });

exports.onUserImageChange = functions.firestore
  .document('/users/{userId}')
  .onUpdate((change) => {
    console.log(change.before.data());
    console.log(change.after.data());
    if (change.before.data().imageUrl !== change.after.data().imageUrl) {
      console.log('image has changed');
      const batch = db.batch();
      return db
        .collection('products')
        .where('userHandle', '==', change.before.data().handle)
        .get()
        .then((data) => {
          data.forEach((doc) => {
            const product = db.doc(`/products/${doc.id}`);
            batch.update(product, { userImage: change.after.data().imageUrl });
          });
          return batch.commit();
        });
    } else return true;
  });

exports.onProductDelete = functions.firestore
  .document('/products/{productId}')
  .onDelete((snapshot, context) => {
    const productId = context.params.productId;
    const batch = db.batch();
    return db
      .collection('comments')
      .where('productId', '==', productId)
      .get()
      .then((data) => {
        data.forEach((doc) => {
          batch.delete(db.doc(`/comments/${doc.id}`));
        });
        return db.collection('likes').where('productId', '==', productId).get();
      })
      .then((data) => {
        data.forEach((doc) => {
          batch.delete(db.doc(`/likes/${doc.id}`));
        });
        return db
          .collection('notifications')
          .where('productId', '==', productId)
          .get();
      })
      .then((data) => {
        data.forEach((doc) => {
          batch.delete(db.doc(`/notifications/${doc.id}`));
        });
        return batch.commit();
      })
      .catch((err) => console.error(err));
  });
