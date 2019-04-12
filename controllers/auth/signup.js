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

  // Email and Password are required
  if (!email || !password || !type) {
    return res.status(400).json({
      status: 400,
      error: 'Email, Password and type are required !',
    });
  }

  // Type should be client / staff
  const userTypes = ['client', 'staff'];
  type.toLowerCase();
  const isTrue = userTypes.indexOf(type);
  if (isTrue < 0) {
    return res.status(400).json({
      status: 400,
      error: 'Type should either be client / staff',
    });
  }

  let isAdminTrue = isAdmin;
  if (type === 'client') {
    isAdminTrue = false;
  }

  // generate user id basing on list length
  const userId = users.length + 1;

  // hashpassword
  const hashedPassword = bcrypt.hashSync(password, 8);

  // capture data
  const data = {
    id: userId, email, firstName, lastName, password: hashedPassword, type, isAdmin: isAdminTrue,
  };
  const doesEmailAlreadyExist = users.some(user => user.email === data.email);
  if (doesEmailAlreadyExist) {
    return res.status(400).json({
      status: 400,
      error: 'Email already exists, try another',
    });
  }
  users.push(data);

  // return the JWT token for the future API calls
  return res.status(200).json({
    status: 200,
    data: {
      token: middleware.token(data.id),
      id: data.id,
      firstName,
      lastName,
      email,
      type,
      isAdmin: data.isAdmin,
    },
  });
};
