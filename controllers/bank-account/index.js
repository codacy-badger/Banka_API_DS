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
