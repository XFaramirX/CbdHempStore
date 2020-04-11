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

exports.getProducts = (req, res) => {
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
