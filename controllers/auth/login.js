const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const config = require('../../config');

// import user data storage
const { users } = require('../../models');

// user login
exports.login = (req, res) => {
  const { password, email } = req.body;
  const isAuthenticated = users.some(
    user => bcrypt.compareSync(password, user.password) && user.email === email,
  );

  if (isAuthenticated !== true) {
    // Wrong password
    res.json({
      status: 401,
      error: 'Wrong email or password',
    });
  }

  users.forEach((user) => {
    if (user.email === email) {
      const token = jwt.sign({ email },
        config.secret,
        { expiresIn: '24h' });

      // return the JWT token for the future API calls
      res.json({
        status: 200,
        data: {
          token,
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
        },
      });
    }
  });
};
