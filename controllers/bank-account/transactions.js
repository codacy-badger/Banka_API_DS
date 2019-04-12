/* eslint-disable consistent-return */
// Import Bank account database
const { bankAccount } = require('../../models');
// Current user information
const currentUser = require('./utils');

// Credit user account
exports.creditTransaction = (req, res) => {
  const { params: { accountNumber }, body: { amount } } = req;

  // Ensure amount is float / integer
  const cash = Number(amount);
  // eslint-disable-next-line use-isnan
  if (cash === NaN) {
    return res.json({
      status: 400,
      error: 'Invalid amount format !!!',
    });
  }
  // Zero and negative values not allowed
  if (cash <= 0) {
    return res.status(400).json({
      status: 400,
      error: 'Amount must greated than zero(0)',
    });
  }

  // User must be staff/admin to perform the operation
  const userData = currentUser(req.userId);
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
  // Check for bank account with the provided account number
  let accountObj = null;
  bankAccount.forEach((account) => {
    if (account.accountNumber.toString() === accountNumber) {
      accountObj = account;
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
  // Credit bank account
  accountObj.balance = (Number(accountObj.balance) + cash);
  accountObj.transactionHistory.push({
    transactionId: new Date().valueOf(),
    transactionType: 'Debit',
    cashier: req.userId,
    accountBalance: accountObj.balance,
    amount: cash,
  });
  const { transactionHistory } = accountObj;
  const transaction = transactionHistory[transactionHistory.length - 1];
  // Return account details
  return res.status(202).json({
    status: 202,
    data: {
      transactionId: transaction.transactionId,
      accountNumber: accountObj.accountNumber,
      amount: transaction.amount,
      cashier: transaction.cashier,
      transactionType: transaction.transactionType,
      accountBalance: accountObj.balance,
    },
  });
};

// Debit user account
exports.debitTransaction = (req, res) => {
  const { params: { accountNumber }, body: { amount } } = req;

  // Ensure amount is float / integer
  const cash = Number(amount);
  // eslint-disable-next-line use-isnan
  if (cash === NaN) {
    return res.status(400).json({
      status: 400,
      error: 'Invalid amount format !!!',
    });
  }

  // Zero and negative values not allowed
  if (cash <= 0) {
    return res.status(400).json({
      status: 400,
      error: 'Amount must greated than zero(0)',
    });
  }
  // User must be staff/admin to perform the operation
  const userData = currentUser(req.userId);
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
  // Check for bank account with the provided account number
  let accountObj = null;
  bankAccount.forEach((account) => {
    if (account.accountNumber.toString() === accountNumber) {
      accountObj = account;
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
  // Debit bank account
  // User should not request more than the available balance
  if (cash > Number(accountObj.balance)) {
    return res.status(400).json({
      status: 400,
      error: 'You can not withdraw more than the available balance',
    });
  }
  // Otherwise continue
  accountObj.balance = (Number(accountObj.balance) - cash);
  // Register in transaction history
  accountObj.transactionHistory.push({
    transactionId: new Date().valueOf(),
    transactionType: 'Credit',
    cashier: req.userId,
    accountBalance: accountObj.balance,
    amount: cash,
  });

  const { transactionHistory } = accountObj;
  const transaction = transactionHistory[transactionHistory.length - 1];
  // Return account details
  return res.status(202).json({
    status: 202,
    data: {
      transactionId: transaction.transactionId,
      accountNumber: accountObj.accountNumber,
      amount: transaction.amount,
      cashier: transaction.cashier,
      transactionType: transaction.transactionType,
      accountBalance: accountObj.balance,
    },
  });
};
