const bcrypt = require('bcryptjs');
// import token generator
const middleware = require('../../middleware');

// import user data storage
const { users } = require('../../models');

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

  // return the JWT token for the future API calls
  res.status(200).json({
    status: 200,
    data: {
      token: middleware.token(data.id),
      id: data.id,
      firstName,
      lastName,
      email,
      type,
      isAdmin,
    },
  });
};
