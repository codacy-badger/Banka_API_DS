/* eslint-disable consistent-return */
// Import User account database
const { users } = require('../../models');

// Current user data
exports.currentUser = (id) => {
  let userData = null;
  users.forEach((user) => {
    if (user.id === id) {
      userData = user;
    }
  });
  return userData;
};

// Restrict access to only staff/admin
// client can not perform debit and credit transactions
exports.checkUserType = (userData, res) => {
  if (userData) {
    if (userData.type === 'client' || userData.isAdmin === false) {
      return res.status(401).json({
        status: 401,
        error: 'Access denied !!!',
      });
    }
  } else {
    // User does not exist. Deleted when list was cleared
    return res.status(401).json({
      status: 401,
      error: 'Token is expired, please login again!',
    });
  }
};

exports.isNotClient = (userData, res) => {
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
};


// Transaction details
exports.transactionData = (transaction, accountObj) => (
  {
    transactionId: transaction.transactionId,
    accountNumber: accountObj.accountNumber,
    amount: transaction.amount,
    cashier: transaction.cashier,
    transactionType: transaction.transactionType,
    accountBalance: accountObj.balance,
  }
);
