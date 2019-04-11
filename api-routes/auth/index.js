// Initialize express router
const router = require('express').Router();

// import signup
const signupController = require('../../controllers/auth/signup');
const loginController = require('../../controllers/auth/login');


// auth routes
router.route('/signup')
  .post(signupController.signup);
router.route('/login')
  .post(loginController.login);

// Export API routes
module.exports = router;
