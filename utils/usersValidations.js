// Email validation via regx
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Check if email already exists in the users array
function emailAlreadyExists(email, users) {
  return users.some((user) => user.email === email);
}

// Name validation (minimum 3 characters)
function isValidName(name) {
  return typeof name === 'string' && name.length >= 3;
}

// Validate ID (numeric and unique)
function isValidId(id, users) {
  const isNumeric = !isNaN(id);
  const isUnique = !users.some((user) => user.id === id);
  return isNumeric && isUnique;
}

// Check if user ID already exists in the users array
function userIdExists(id, users) {
  return users.some((user) => user.id === id);
}

// Principal function to validate a user object
function validateUser(user) {
  const errors = [];

  if (!isValidName(user.name)) {
    errors.push('The name must have at least three characters');
  }

  if (!isValidEmail(user.email)) {
    errors.push('Email is not valid');
  }

  return {
    isValid: !errors.length,
    errors: errors,
  };
}

module.exports = {
  isValidEmail,
  emailAlreadyExists,
  isValidName,
  isValidId,
  userIdExists,
  validateUser,
};
