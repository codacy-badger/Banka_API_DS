/* eslint-disable consistent-return */
const bcrypt = require('bcryptjs');
// import token generator
const middleware = require('../../middleware');
// import user data storage
const { users } = require('../../models');

// user login
exports.login = (req, res) => {
  const { password, email } = req.body;
  // Email and Password are required
  if (!email || !password) {
    return res.status(400).json({
      status: 400,
      error: 'Email, Password and type are required !',
    });
  }

  const isAuthenticated = users.some(
    user => bcrypt.compareSync(password, user.password) && user.email === email,
  );

  if (isAuthenticated !== true) {
    // Wrong password
    return res.json({
      status: 401,
      error: 'Wrong email or password',
    });
  }

  users.forEach((user) => {
    if (user.email === email) {
      // return the JWT token for the future API calls
      return res.json({
        status: 200,
        data: {
          token: middleware.token(user.id),
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
        },
      });
    }
  });
};

// fetch all users
exports.allUsers = (req, res) => res.status(200).json({
  status: 200,
  data: users,
  id: req.userId,
});
