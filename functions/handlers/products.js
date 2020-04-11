const { db } = require('../util/admin');
const FieldValue = require('firebase-admin').firestore.FieldValue;

exports.addProduct = (req, res) => {
  db.collection('products')
    .add({
      id: req.body.id,
      name: req.body.name,
      createdBy: req.user.email,
      description: req.body.description,
      timestamp: FieldValue.serverTimestamp(),
    })
    .then((ref) => {
      res.json({ message: `document with id: ${ref.id} succesfully created` });
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
