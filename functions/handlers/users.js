const { admin } = require('../util/admin');
const { firebase } = require('../util/firebase');
const { isEmpty } = require('../util/validators');

exports.signUp = (req, res) => {
  const newUser = {
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
    photoURL: 'http://www.example.com/12345678/photo.png',
    disabled: false,
    handle: req.body.handle,
    disabled: false,
    emailVerified: false,
  };

  const errors = {};

  if (isEmpty(req.body.name)) {
    errors.name = 'Name should not be empty';
  } else if (isEmpty(req.body.name)) {
    errors.confirmPassword = 'Password fields should not be empty';
  }

  if (req.body.confirmPassword !== req.body.password) {
    errors.password = 'Password should match';
  }
  console.log(errors);

  if (Object.keys(errors).length > 0) {
    return res.status(400).json(errors);
  }
  admin
    .auth()
    .createUser(newUser)
    .then((userRecord) => {
      // See the UserRecord reference doc for the contents of userRecord.
      admin
        .auth()
        .createCustomToken(userRecord.uid)
        .then((customToken) => {
          res.status(201).json({ token: `${customToken}` });
        })
        .catch((error) => {
          res.status(500).json({ error: `Token ${error}` });
        });
    })
    .catch((error) => {
      if (
        error.code === 'auth/email-already-exists' ||
        error.code === 'auth/invalid-email' ||
        error.code === 'auth/invalid-password'
      ) {
        res.status(400).json({ message: `${error}` });
        console.log(error.code.message);
      } else {
        res.status(500).json({ message: `${error}` });
        console.log(error.code);
      }
    });
};

exports.signIn = (req, res) => {
  const User = {
    email: req.body.email,
    password: req.body.password,
  };

  const errors = {};

  if (isEmpty(req.body.email)) {
    errors.name = 'email should not be empty';
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json(errors);
  }
  firebase
    .auth()
    .signInWithEmailAndPassword(User.email, User.password)
    .then((data) => {
      res.status(200).json(data);
    })
    .catch(function (error) {
      res.status(500).json(error);
    });
};

exports.getUsers = (req, res) => {
  const maxResults = 10; // optional arg.

  admin
    .auth()
    .listUsers(maxResults)
    .then((userRecords) => {
      let users = [];
      userRecords.users.forEach((user) => users.push(user));
      res.json(users);
      res.end('Retrieved users list successfully.');
    })
    .catch((error) => console.log(error));
};
