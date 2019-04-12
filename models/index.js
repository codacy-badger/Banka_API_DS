// User database
// Format
// {
//   id, email, firstName, lastName, password: hashedPassword, type, isAdmin: isAdminTrue,
// }
const users = [];

// Bank account database
// Format
// {
//   id, accountNumber, createdOn, owner, status, type, balance, transactionHistory:{
//     transactionId: "etry8764789", cashier, transactionType, amount
//   },
// }
const bankAccount = [];

module.exports = {
  users,
  bankAccount,
};
