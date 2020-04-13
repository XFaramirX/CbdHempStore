const { db } = require('../util/admin');
const FieldValue = require('firebase-admin').firestore.FieldValue;
const { isEmpty } = require('../util/validators');

exports.addProduct = (req, res) => {
  const errors = {};

  if (isEmpty(req.body.id)) {
    errors.id = 'id should not be empty';
    return res.status(400).json(errors);
  } else if (isEmpty(req.body.description)) {
    errors.id = 'description should not be empty';
    return res.status(400).json(errors);
  }

  db.collection('products')
    .add({
      id: req.body.id,
      name: req.body.name,
      createdBy: req.user.email,
      description: req.body.description,
      timestamp: FieldValue.serverTimestamp(),
    })
    .then((ref) => {
      res.json({
        message: `document with id: ${ref.id} succesfully created`,
      });
    })
    .catch((error) => {
      res.status(500).json({ message: 'There was an error' });
    });
};

exports.getAllProducts = (req, res) => {
  db.collection('products')
    .orderBy('name', 'desc')
    .get()
    .then((snapshot) => {
      let products = [];
      snapshot.forEach((doc) => {
        products.push({ docId: doc.id, data: doc.data() });
      });
      return res.json(products);
    })
    .catch((err) => {
      res.status(500).json({ message: `Error getting documents ${err}` });
    });
};

exports.getProduct = (req, res) => {
  let productData = {};
  db.doc(`/products/${req.params.productId}`)
    .get()
    .then((doc) => {
      if (!doc.exists) {
        return res.status(404).json({ error: 'Product not found' });
      }
      productData = doc.data();
      productData.productId = doc.id;
      return db
        .collection('comments')
        .orderBy('createdAt', 'desc')
        .where('productId', '==', req.params.productId)
        .get();
    })
    .then((data) => {
      productData.comments = [];

      data.forEach((doc) => {
        productData.comments.push(doc.data());
      });
      return res.json(productData);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ error: error.code });
    });
};

exports.addComment = (req, res) => {
  if (isEmpty(req.body.body))
    return res.status(400).json({ error: 'Must not be empty' });

  const newComment = {
    body: req.body.body,
    createdAt: new Date().toISOString(),
    productId: req.params.productId,
    userHandle: req.user.uid,
    userImage: req.user.picture,
  };

  db.doc(`/product/${req.params.productId}`)
    .get()
    .then((doc) => {
      if (doc.exists) {
        res.status(404).json({ error: 'Document not found' });
      }
      return db.collection('comments').add(newComment);
    })
    .then(() => {
      res.status(200).json(newComment);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: 'Something went wrong' });
    });
};
