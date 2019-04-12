/* eslint-disable consistent-return */
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
  // generate user id basing on list length
  const accountId = bankAccount.length + 1;

  // Bank account details
  const data = {
    id: accountId,
    accountNumber: accountGenerator(),
    createdOn: datetime,
    owner: req.userId,
    status: 'active',
    type,
    balance: 0.00,
    transactionHistory: [],
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
        transactionHistory: data.transactionHistory,
      },
    });
  }
};

// Deactivate/acivate bank account
exports.accountStatus = (req, res) => {
  const { body: { status }, params: { accountNumber } } = req;

  // User must be staff/admin to perform the operation
  const userData = currentUser(req.userId);
  if (userData) {
    if (userData.type === 'client') {
      res.status(401).json({
        status: 401,
        error: 'Access denied !!!',
      });
    }
  } else {
    // User does not exist. Deleted when list was cleard
    res.status(401).json({
      status: 401,
      error: 'Token is expired, please login again!',
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


// Deactivate/acivate bank account
exports.deleteAccount = (req, res) => {
  const { params: { accountNumber } } = req;

  // User must be staff/admin to perform the operation
  const userData = currentUser(req.userId);
  if (userData) {
    if (userData.type === 'client') {
      res.status(401).json({
        status: 401,
        error: 'Access denied !!!',
      });
    }
  } else {
    // User does not exist. Deleted when list was cleard
    res.status(401).json({
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
    res.status(404).json({
      status: 404,
      error: 'Invalid account number, please check and try again!',
    });
  } else {
    // Delete bank account
    bankAccount.splice(index, 1);
    // Return account details
    res.status(202).json({
      status: 202,
      data: {
        message: `Account with accountNumber: ${accountNumber} has been successfuly deleted`,
      },
    });
  }
};

// Credit user account
exports.creditTransaction = (req, res) => {
  const { params: { accountNumber }, body: { amount } } = req;

  // Ensure amount is float / integer
  const cash = Number(amount);
  // eslint-disable-next-line use-isnan
  if (cash === NaN) {
    res.json({
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
      res.status(401).json({
        status: 401,
        error: 'Access denied !!!',
      });
    }
  } else {
    // User does not exist. Deleted when list was cleared
    res.status(401).json({
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
    res.status(404).json({
      status: 404,
      error: 'Invalid account number, please check and try again!',
    });
  } else {
    // Credit bank account
    accountObj.balance = (Number(accountObj.balance) + cash);
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
    res.status(202).json({
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
  }
};

// Debit user account
exports.debitTransaction = (req, res) => {
  const { params: { accountNumber }, body: { amount } } = req;

  // Ensure amount is float / integer
  const cash = Number(amount);
  // eslint-disable-next-line use-isnan
  if (cash === NaN) {
    res.status(400).json({
      status: 400,
      error: 'Invalid amount format !!!',
    });
  }

  // Zero and negative values not allowed
  if (cash <= 0) {
    res.status(400).json({
      status: 400,
      error: 'Amount must greated than zero(0)',
    });
  }
  // User must be staff/admin to perform the operation
  const userData = currentUser(req.userId);
  if (userData) {
    if (userData.type === 'client' || userData.isAdmin === false) {
      res.status(401).json({
        status: 401,
        error: 'Access denied !!!',
      });
    }
  } else {
    // User does not exist. Deleted when list was cleared
    res.status(401).json({
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
    res.status(404).json({
      status: 404,
      error: 'Invalid account number, please check and try again!',
    });
  } else {
    // Debit bank account
    // User should not request more than the available balance
    if (cash > Number(accountObj.balance)) {
      res.status(400).json({
        status: 400,
        error: 'You can not withdraw more than the available balance',
      });
      return;
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
    res.status(202).json({
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
  }
};
