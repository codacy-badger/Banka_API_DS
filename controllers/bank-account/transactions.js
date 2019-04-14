/* eslint-disable consistent-return */
// Import Bank account database
const { bankAccount } = require('../../models');
// Current user information
const utils = require('./utils');

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
  if (utils.checkAmount(cash, res)) {
    return utils.checkAmount(cash, res);
  }
  // User must be staff/admin to perform the operation
  if (utils.checkUserType(utils.currentUser(req.userId), res)) {
    return utils.checkUserType(utils.currentUser(req.userId), res);
  }

  // Check for bank account with the provided account number
  const accountObj = utils.checkAccountNumber(bankAccount, accountNumber);

  // Check if account exists
  if (utils.ifNoAccount(accountObj, res)) {
    // Account does not exist
    return utils.ifNoAccount(accountObj, res);
  }

  // Credit bank account
  accountObj.balance = (Number(accountObj.balance) + cash);
  // save debit transaction
  utils.saveTransaction(accountObj, req, cash, 'Credit');

  const { transactionHistory } = accountObj;
  const transaction = transactionHistory[transactionHistory.length - 1];
  // Return account details
  return res.status(202).json({
    status: 202,
    data: utils.transactionData(transaction, accountObj),
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
  if (utils.checkAmount(cash, res)) {
    return utils.checkAmount(cash, res);
  }

  // User must be staff/admin to perform the operation
  if (utils.checkUserType(utils.currentUser(req.userId), res)) {
    return utils.checkUserType(utils.currentUser(req.userId), res);
  }

  // Check for bank account with the provided account number
  const accountObj = utils.checkAccountNumber(bankAccount, accountNumber);

  // Check if account exists
  if (utils.ifNoAccount(accountObj, res)) {
    // Account does not exist
    return utils.ifNoAccount(accountObj, res);
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
  utils.saveTransaction(accountObj, req, cash, 'Debit');

  const { transactionHistory } = accountObj;
  const transaction = transactionHistory[transactionHistory.length - 1];
  // Return account details
  return res.status(202).json({
    status: 202,
    data: utils.transactionData(transaction, accountObj),
  });
};
