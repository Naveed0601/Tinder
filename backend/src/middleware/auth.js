const jwt = require("jsonwebtoken");

const User = require("../models/user");

const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;

    if (!token) {
      return res.status(400).send("Token is not provided");
    }

    const decodedObj = await jwt.verify(token, "DEV@$123");

    const { _id } = decodedObj;

    const user = await User.findById(_id);

    if (!user) {
      return res.status(401).send("User not found");
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(400).send({ message: "ERROR" }, error.message);
  }
};

module.exports = { userAuth };
