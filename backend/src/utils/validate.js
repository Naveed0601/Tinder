const validator = require("validator");

const validateSignUpData = (req) => {
  const { firstName, lastName, emailId, password } = req.body;
  console.log(req.body);
  if (!firstName || !lastName) {
    throw new Error("Name is not valid");
  }

  if (!validator.isEmail(emailId)) {
    throw new Error("Email is not valid");
  }

  if (
    !password ||
    password.length < 8 ||
    !/[A-Z]/.test(password) ||
    !/[0-9]/.test(password)
  ) {
    throw new Error(
      "Password must be at least 8 characters long, include an uppercase letter, and a number."
    );
  }
};

module.exports = { validateSignUpData };
