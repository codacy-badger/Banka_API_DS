/* eslint-disable consistent-return */
// Import Bank account database
const { bankAccount } = require('../../models');
// Current user information
const currentUser = require('./utils');

// Deactivate/acivate bank account
const deleteAccount = (req, res) => {
  const { params: { accountNumber } } = req;

  // User must be staff/admin to perform the operation
  const userData = currentUser(req.userId);
  if (userData) {
    if (userData.type === 'client') {
      return res.status(401).json({
        status: 401,
        error: 'Access denied !!!',
      });
    }
  } else {
    // User does not exist. Deleted when list was cleard
    return res.status(401).json({
      status: 401,
      error: 'Token is expired, please login again!',
    });
  }
  // Check for bank account with the provided account number
  let accountObj = null;
  let index = null;
  bankAccount.forEach((account, i) => {
    if (account.accountNumber.toString() === accountNumber) {
      accountObj = account;
      index = i;
    }
  });

  // Check if account exists
  if (!accountObj) {
    // Account does not exist
    return res.status(404).json({
      status: 404,
      error: 'Invalid account number, please check and try again!',
    });
  }
  // Delete bank account
  bankAccount.splice(index, 1);
  // Return account details
  return res.status(202).json({
    status: 202,
    data: {
      message: `Account with accountNumber: ${accountNumber} has been successfuly deleted`,
    },
  });
};

module.exports = deleteAccount;
