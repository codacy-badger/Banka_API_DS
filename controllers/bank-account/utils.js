// Import User account database
const { users } = require('../../models');

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

module.exports = currentUser;
