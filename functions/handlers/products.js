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

  const newProduct = {
    id: req.body.id,
    name: req.body.name,
    createdBy: req.user.email,
    userHandle: req.user.uid,
    description: req.body.description,
    createdAt: new Date().toISOString(),
    timestamp: FieldValue.serverTimestamp(),
    likeCount: 0,
    commentCount: 0,
  };

  db.collection('products')
    .add(newProduct)
    .then((ref) => {
      const product = newProduct;
      product.id = ref.id;
      res.json(product);
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

  db.doc(`/products/${req.params.productId}`)
    .get()
    .then((doc) => {
      if (!doc.exists) {
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

exports.likeProduct = (req, res) => {
  const likeDocument = db
    .collection('likes')
    .where('userHandle', '==', req.user.uid)
    .where('productId', '==', req.params.productId)
    .limit(1);

  const productDocument = db.doc(`/products/${req.params.productId}`);

  let productData;
  productDocument
    .get()
    .then((doc) => {
      if (doc.exists) {
        productData = doc.data();
        productData.productId = doc.id;
        return likeDocument.get();
      } else {
        return res.status(404).json({ error: 'Product not found' });
      }
    })
    .then((data) => {
      if (data.empty) {
        return db
          .collection('likes')
          .add({
            productId: req.params.productId,
            userHandle: req.user.uid,
            createdAt: new Date().toISOString(),
          })
          .then(() => {
            productData.likeCount++;
            return productDocument.update({ likeCount: productData.likeCount });
          })
          .then(() => {
            return res.json(productData);
          });
      } else {
        return res.status(400).json({ error: 'Product already liked' });
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: err.code });
    });
};

exports.unlikeProduct = (req, res) => {
  const likeDocument = db
    .collection('likes')
    .where('userHandle', '==', req.user.uid)
    .where('productId', '==', req.params.productId)
    .limit(1);

  const productDocument = db.doc(`/products/${req.params.productId}`);

  let productData;

  productDocument
    .get()
    .then((doc) => {
      if (doc.exists) {
        productData = doc.data();
        productData.productId = doc.id;
        return likeDocument.get();
      } else {
        return res.status(404).json({ error: 'Product not found' });
      }
    })
    .then((data) => {
      if (data.empty) {
        return res.status(400).json({ error: 'Product not liked' });
      } else {
        return db
          .doc(`/likes/${data.docs[0].id}`)
          .delete()
          .then(() => {
            productData.likeCount--;
            return productDocument.update({ likeCount: productData.likeCount });
          })
          .then(() => {
            res.json(productData);
          });
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: err.code });
    });
};
// Delete a scream
exports.deleteProduct = (req, res) => {
  const document = db.doc(`/products/${req.params.productId}`);
  document
    .get()
    .then((doc) => {
      if (!doc.exists) {
        return res.status(404).json({ error: 'Product not found' });
      }
      if (doc.data().userHandle !== req.user.uid) {
        return res.status(403).json({ error: 'Unauthorized' });
      } else {
        return document.delete();
      }
    })
    .then(() => {
      res.json({ message: 'Product deleted successfully' });
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).json({ error: err.code });
    });
};
