// Initialize express router
const router = require('express').Router();

// import signup
const authentication = require('../../controllers/auth/signup');
// auth routes
router.route('/signup')
  .post(authentication.signup);

// Export API routes
module.exports = router;
