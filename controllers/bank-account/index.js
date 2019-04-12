// Import Bank account database
const { bankAccount, users } = require('../../models');

const datetime = new Date();

// Generate a bank account number, a nine character number
const accountGenerator = () => Math.floor(Math.random() * 1000000000);

// Current user data
const currentUser = (id) => {
  let userData = null;
  users.forEach((user) => {
    if (user.id === id) {
      userData = user;
    }
  });
  return userData;
};

// Create bank account
exports.createBankAccount = (req, res) => {
  const { type } = req.body;
  //   console.log(users);
  // generate user id basing on list length
  const accountId = bankAccount.length + 1;

  // Bank account details
  const data = {
    id: accountId, accountNumber: accountGenerator(), createdOn: datetime, owner: req.userId, status: 'active', type, balance: 0.00,
  };

  // Getting the current user object
  const user = currentUser(req.userId);

  if (!user) {
    // It is possible to have no user object but with valid token Forexample if header
    // contains a token with id of user not existing because user list was reset
    res.status(401).json({
      status: 401,
      error: 'Token has expired, please login again!',
    });
  } else {
    // add create bank account
    bankAccount.push(data);

    // account response
    res.status(201).json({
      status: 201,
      data: {
        accountNumber: data.accountNumber,
        createdOn: data.createdOn,
        status: data.status,
        type: data.type,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        openingBalance: data.balance,
      },
    });
  }
};

// Deactivate/acivate bank account
exports.accountStatus = (req, res) => {
  const { body: { status }, params: { accountNumber } } = req;

  // User must be staff/admin to perform the operation
  const userData = currentUser(req.userId);
  if (userData.type === 'client') {
    res.status(401).json({
      status: 401,
      error: 'Access denied !!!',
    });
  }
  // status should dormant / active
  const statusArray = ['dormant', 'active'];
  const isPresent = (statusArray.indexOf(status) > -1);
  if (!isPresent) {
    res.status(400).json({
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
    res.status(404).json({
      status: 404,
      error: 'Invalid account number, please check and try again!',
    });
  } else {
    // Update the account status from active to deactive
    accountObj.status = 'dormant';

    // Return account details
    res.status(202).json({
      status: 202,
      data: {
        accountNumber,
        status,
      },
    });
  }
};
