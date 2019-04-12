// Initialize express router
const router = require('express').Router();

// import signup
const signupController = require('../controllers/auth/signup');
const loginController = require('../controllers/auth/login');
const bankTransactions = require('../controllers/bank-account/transactions');
const deleteAccount = require('../controllers/bank-account/deleteAccount');
const accountStatus = require('../controllers/bank-account/accountStatus');
const createBankAccount = require('../controllers/bank-account/createAccount');

// import VerifyToken middleware function
const middleware = require('../middleware');

// auth routes
router.route('/signup')
  .post(signupController.signup);
router.route('/login')
  .post(loginController.login);
router.route('/accounts')
  .post(middleware.verifyToken, createBankAccount);
router.route('/account/:accountNumber')
  .patch(middleware.verifyToken, accountStatus)
  .delete(middleware.verifyToken, deleteAccount);
router.route('/transactions/:accountNumber/credit')
  .post(middleware.verifyToken, bankTransactions.creditTransaction);
router.route('/transactions/:accountNumber/debit')
  .post(middleware.verifyToken, bankTransactions.debitTransaction);
router.route('/users')
  .get(middleware.verifyToken, loginController.allUsers);
// Export API routes
module.exports = router;
