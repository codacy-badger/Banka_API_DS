/* eslint-disable consistent-return */
// Import Bank account database
const { bankAccount } = require('../../models');
// Current user information
const utils = require('./utils');

// Deactivate/acivate bank account
const accountStatus = (req, res) => {
  const { body: { status }, params: { accountNumber } } = req;

  // User must be staff/admin to perform the operation
  if (utils.isNotClient(utils.currentUser(req.userId), res)) {
    return utils.isNotClient(utils.currentUser(req.userId), res);
  }

  // status should dormant / active
  const statusArray = ['dormant', 'active'];
  const isPresent = (statusArray.indexOf(status) > -1);
  if (!isPresent) {
    return res.status(400).json({
      status: 400,
      error: 'Status should either be active or dormant',
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
  // Update the account status from active to deactive
  accountObj.status = 'dormant';

  // Return account details
  return res.status(202).json({
    status: 202,
    data: {
      accountNumber,
      status,
    },
  });
};

module.exports = accountStatus;
