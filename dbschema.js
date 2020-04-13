let db = [
  users[
    {
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      confirmPassword: req.body.confirmPassword,
      bio: '',
      photoURL: 'http://www.example.com/12345678/photo.png',
      website: '',
      location: '',
      disabled: false,
      handle: req.body.handle,
      disabled: false,
      emailVerified: false,
    }
  ],
  products[
    {
      id: req.body.id,
      name: req.body.name,
      createdBy: req.user.email,
      description: req.body.description,
      timestamp: FieldValue.serverTimestamp(),
    }
  ],
];
