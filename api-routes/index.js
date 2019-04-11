// Initialize express router
const router = require('express').Router();

// import signup
const signupController = require('../controllers/auth/signup');
const loginController = require('../controllers/auth/login');
const bankController = require('../controllers/bank-account');

// import VerifyToken middleware function
const middleware = require('../middleware');

// auth routes
router.route('/signup')
  .post(signupController.signup);
router.route('/login')
  .post(loginController.login);
router.route('/accounts')
  .post(middleware.verifyToken, bankController.createBankAccount);
router.route('/users')
  .get(middleware.verifyToken, loginController.allUsers);
// Export API routes
module.exports = router;
