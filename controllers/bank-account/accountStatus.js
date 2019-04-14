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
  const statusArray = ['dormant', 'active', 'draft'];
  const isPresent = (statusArray.indexOf(status) > -1);
  if (!isPresent) {
    return res.status(400).json({
      status: 400,
      error: 'Status should either be active or dormant',
    });
  }

  // Check for bank account with the provided account number
  const accountObj = utils.checkAccountNumber(bankAccount, accountNumber);

  // Check if account exists
  if (utils.ifNoAccount(accountObj, res)) {
    // Account does not exist
    return utils.ifNoAccount(accountObj, res);
  }

  // Update the account status to active/dormant/draft to deactive
  accountObj.status = status;

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
