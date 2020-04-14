const { admin, db } = require('../util/admin');
const { firebase } = require('../util/firebase');
const { isEmpty, reduceUserDetails } = require('../util/validators');
const { uuid } = require('uuidv4');

exports.signUp = (req, res) => {
  const newUser = {
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
    displayName: '',
    photoURL: 'http://www.example.com/12345678/photo.png',
    disabled: false,
    phoneNumber: '+11234567890',
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

  if (Object.keys(errors).length > 0) {
    return res.status(400).json(errors);
  }
  admin
    .auth()
    .createUser(newUser)
    .then((userRecord) => {
      const userCredentials = {
        name: req.body.name,
        bio: '',
        website: '',
        location: '',
        email: userRecord.email,
        createdAt: new Date().toISOString(),
        userId: userRecord.uid,
      };
      try {
        db.doc(`/users/${userRecord.uid}`).set(userCredentials);
      } catch (error) {
        console.log(error);
      }
      return userRecord;
    })
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

exports.getAllUsers = (req, res) => {
  const maxResults = 50; // optional arg.

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

exports.uploadImage = (req, res) => {
  const path = require('path');
  const os = require('os');
  const fs = require('fs');

  // Node.js doesn't have a built-in multipart/form-data parsing library.
  // Instead, we can use the 'busboy' library from NPM to parse these requests.
  const Busboy = require('busboy');
  if (req.method !== 'POST') {
    // Return a "method not allowed" error
    return res.status(405).end();
  }
  const busboy = new Busboy({ headers: req.headers });
  const tmpdir = os.tmpdir();

  // This object will accumulate all the fields, keyed by their name
  const fields = {};

  // This object will accumulate all the uploaded files, keyed by their name.
  const uploads = {};

  // This code will process each non-file field in the form.
  busboy.on('field', (fieldname, val) => {
    // TODO(developer): Process submitted field values here
    console.log(`Processed field ${fieldname}: ${val}.`);
    fields[fieldname] = val;
  });

  const fileWrites = [];
  // This code will process each file uploaded.
  busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
    // Note: os.tmpdir() points to an in-memory file system on GCF
    // Thus, any files in it must fit in the instance's memory.
    console.log(`Processed file ${filename}`);

    if (mimetype !== 'image/png' && mimetype !== 'image/jpeg') {
      res.status(400).json({ error: 'Wrong file type submmitted' });
    }

    const fileExtension = filename.split('.')[filename.split('.').length - 1];
    const imageFileName = `${Math.round(
      Math.random() * 100000000000
    )}.${fileExtension}`;

    const filepath = path.join(tmpdir, imageFileName);
    uploads['imageFile'] = filename;
    uploads['imageFilePath'] = filepath;
    uploads['imageFileName'] = imageFileName;
    uploads['imageFileType'] = mimetype;

    const writeStream = fs.createWriteStream(filepath);
    file.pipe(writeStream);

    // File was processed by Busboy; wait for it to be written to disk.
    const promise = new Promise((resolve, reject) => {
      file.on('end', () => {
        writeStream.end();
      });
      writeStream.on('finish', resolve);
      writeStream.on('error', reject);
    });
    fileWrites.push(promise);
  });

  // Triggered once all uploaded files are processed by Busboy.
  // We still need to wait for the disk writes (saves) to complete.

  busboy.on('finish', async () => {
    await Promise.all(fileWrites);

    admin
      .storage()
      .bucket()
      .upload(uploads.imageFilePath, {
        resumable: false,
        metadata: {
          metadata: {
            contentType: uploads.imageFileType,
            uploadedBy: req.user.email,
            firebaseStorageDownloadTokens: uuid(),
          },
        },
      })
      .then((imageData) => {
        const imageUrl = `https://firebasestorage.googleapis.com/v0/b/${imageData[0].metadata.selfLink.slice(
          40
        )}?alt=media`;

        admin
          .auth()
          .updateUser(req.user.uid, {
            photoURL: imageUrl,
          })
          .then(function (userRecord) {
            console.log('Successfully updated user', userRecord.toJSON());
          })
          .catch(function (error) {
            console.log('Error updating user:', error);
          });

        return db.doc(`/users/${req.user.uid}`).update({ imageUrl: imageUrl });
      })
      .then(() => {
        res.status(200).json({ message: 'Image uploaded succesfully' });
      })
      .catch((error) => {
        res.status(500).json({ message: `${error}` });
      });
  });

  busboy.end(req.rawBody);
};

exports.updateUser = (req, res) => {
  let userDetails = reduceUserDetails(req.body);

  db.doc(`/users/${req.user.uid}`)
    .update(userDetails)
    .then(() => {
      return res.status(200).json({ message: 'updated succesfully' });
    })
    .catch(() => {
      return res.status(500).json({ error: error.code });
    });
};

exports.getAuthenticatedUser = (req, res) => {
  let userData = {};
  db.doc(`/users/${req.user.uid}`)
    .get()
    .then((doc) => {
      if (doc.exists) {
        userData.userCredentials = doc.data();
        return db
          .collection('likes')
          .where('userHandle', '==', req.user.uid)
          .get();
      }
    })
    .then((data) => {
      userData.likes = [];
      data.forEach((doc) => {
        userData.likes.push(doc.data());
      });
      return db
        .collection('notifications')
        .where('recipient', '==', req.user.uid)
        .orderBy('createdAt', 'desc')
        .limit(10)
        .get();
    })
    .then((data) => {
      userData.notifications = [];
      data.forEach((doc) => {
        userData.notifications.push({
          recipient: doc.data().recipient,
          sender: doc.data().sender,
          createdAt: doc.data().createdAt,
          productId: doc.data().productId,
          type: doc.data().type,
          read: doc.data().read,
          notificationId: doc.id,
        });
      });
      return res.json(userData);
    })
    .catch((error) => {
      console.log(error);

      return res.status(500).json({ error: error.code });
    });
};

exports.getUserDetails = (req, res) => {
  let userData = {};
  db.doc(`/users/${req.params.handle}`)
    .get()
    .then((doc) => {
      console.log('HELP');

      console.log(req.params.handle);
      console.log(doc.exists);

      if (doc.exists) {
        userData.user = doc.data();

        return db
          .collection('products')
          .where('userHandle', '==', req.params.handle)
          .orderBy('createdAt', 'desc')
          .get();
      } else {
        return res.status(404).json({ errror: 'User not found' });
      }
    })
    .then((data) => {
      userData.products = [];
      data.forEach((doc) => {
        userData.products.push({
          body: doc.data().body,
          createdAt: doc.data().createdAt,
          userHandle: doc.data().userHandle,
          userImage: doc.data().userImage,
          likeCount: doc.data().likeCount,
          commentCount: doc.data().commentCount,
          productId: doc.id,
        });
      });
      return res.json(userData);
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).json({ error: err.code });
    });
};

exports.markNotificationsRead = (req, res) => {
  let batch = db.batch();
  req.body.forEach((notificationId) => {
    const notification = db.doc(`/notifications/${notificationId}`);
    batch.update(notification, { read: true });
  });
  batch
    .commit()
    .then(() => {
      return res.json({ message: 'Notifications marked read' });
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).json({ error: err.code });
    });
};

exports.getNotifications = async (req, res) => {
  let notifications = [];
  var notificationsRef = db.collection('notifications');

  notificationsRef
    .get()
    .then((snapshot) => {
      snapshot.forEach((doc) => {
        notifications.push({
          docId: doc.id,
          type: doc.data().type,
          recipient: doc.data().recipient,
          read: doc.data().read,
        });
      });
    })
    .then(() => {
      return res.json(notifications);
    })
    .catch((err) => {
      console.log('Error getting documents', err);
    });
};
