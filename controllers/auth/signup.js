const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const config = require('../../config');

// User database
const users = [];

// create user account
exports.signup = (req, res) => {
  const {
    email, firstName, lastName, password, type, isAdmin,
  } = req.body;

  // generate user id basing on list length
  const userId = users.length + 1;

  // hashpassword
  const hashedPassword = bcrypt.hashSync(password, 8);

  // capture data
  const data = {
    id: userId, email, firstName, lastName, password: hashedPassword, type, isAdmin,
  };
  const doesEmailAlreadyExist = users.some(user => user.email === data.email);
  if (doesEmailAlreadyExist) {
    res.status(400).json({
      status: 400,
      error: 'Email already exists, try another',
    });
  }
  users.push(data);

  const token = jwt.sign({ email },
    config.secret,
    { expiresIn: '24h' });

  // return the JWT token for the future API calls
  res.status(200).json({
    status: 200,
    data: {
      token,
      id: data.id,
      firstName,
      lastName,
      email,
      type,
      isAdmin,
    },
  });
};
