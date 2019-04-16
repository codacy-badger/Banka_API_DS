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

  // format firstName and lastName
  const fisrtN = firstName.split(' ').join('');
  const lastN = lastName.split(' ').join('');

  // Email and Password are required
  if (!email || !password || !type) {
    return res.status(400).json({
      status: 400,
      error: 'Email, Password and type are required !',
    });
  }
  // Validate email
  if (!email.match(/^[A-Za-z0-9.+_-]+@[A-Za-z0-9._-]+\.[a-zA-Z]{2,}$/)) {
    return res.status(400).json({
      status: 400,
      error: 'Invalid email format ',
    });
  }

  // Validate password
  if (!password.match(/^(?=.*\d)[0-9a-zA-Z]{8,}$/)) {
    return res.status(400).json({
      status: 400,
      error: 'Weak password, must be at least 8 characters and have at least 1 letter and number',
    });
  }
  // Type should be client / staff
  const userTypes = ['client', 'staff'];

  const userType = type.toLowerCase();
  const isTrue = userTypes.indexOf(userType);
  if (isTrue < 0) {
    return res.status(400).json({
      status: 400,
      error: 'Type should either be client / staff',
    });
  }
  // isAdmin should be [false/true]
  const booln = ['false', 'true'];
  const admin = isAdmin ? isAdmin.toLowerCase() : 'false';
  const result = booln.indexOf(admin);
  if (result < 0) {
    return res.status(400).json({
      status: 400,
      error: 'isAdmin should be set to true/false',
    });
  }

  let isAdminTrue = admin;
  if (type === 'client') {
    isAdminTrue = false;
  }

  // generate user id basing on list length
  const userId = users.length + 1;

  // hashpassword
  const hashedPassword = bcrypt.hashSync(password, 8);

  // capture data
  const data = {
    id: userId,
    email,
    firstName: fisrtN,
    lastName: lastN,
    password: hashedPassword,
    type: userType,
    isAdmin: isAdminTrue,
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
      firstName: data.firstName,
      lastName: data.lastName,
      email,
      type: data.userType,
      isAdmin: data.isAdmin,
    },
  });
};
