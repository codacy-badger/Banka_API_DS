// GENERAL
const email = 'dr.kimpatrick@gmail.com';
const password = 'Kp15712Kp';

// User signup ***************************************

// User data
exports.signup_user_1 = {
  email,
  firstName: 'Patrick',
  lastName: 'KImanje',
  password,
  type: 'client',
  isAdmin: false,
};

// user with missing fields
exports.signup_user_2 = {
  firstName: 'Patrick',
  lastName: 'KImanje',
  password,
  type: 'client',
  isAdmin: false,
};

// user supplies invalid user type
exports.signup_user_3 = {
  email,
  firstName: 'Patrick',
  lastName: 'KImanje',
  password,
  type: 'invalid',
  isAdmin: false,
};

// creating user of type staff
exports.signup_user_4 = {
  email,
  firstName: 'Patrick',
  lastName: 'KImanje',
  password,
  type: 'staff',
  isAdmin: true,
};

exports.signup_user_5 = {
  email: 'invalid format',
  password,
  type: 'staff',
};

exports.signup_user_6 = {
  email,
  password: 'invalid',
  type: 'staff',
};

// User login *************************************

// email and assword exist
exports.login_user_1 = {
  email,
  password,
};

// wrong email or pasword
exports.login_user_2 = {
  email,
  password: 'wrong password',
};
