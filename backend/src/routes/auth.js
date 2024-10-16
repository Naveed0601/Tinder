const express = require("express");
const router = express.Router();
const { validateSignUpData } = require("../utils/validate");
const User = require("../models/user");

const bcrypt = require("bcrypt");
const { userAuth } = require("../middleware/auth");

router.post("/signup", async (req, res) => {
  // Creating a new instance of the user modal
  const { firstName, lastName, emailId, password } = req.body;
  try {
    validateSignUpData(req);

    const passwordHash = await bcrypt.hash(password, 10);
    console.log(passwordHash);

    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
    });
    await user.save();
    res.send("User Added Successfully");
  } catch (error) {
    res.status(401).send("Error saving the user " + error.message);
  }
});

router.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;

    const user = await User.findOne({ emailId: emailId });

    if (!user) {
      throw new Error("User Not Found");
    }
    // console.log(password, user.password);
    const isPasswordValid = await user.validatePassword(password);
    if (isPasswordValid) {
      const token = await user.getJWT();
      res.cookie("token", token);
      res.send("Login Successfull!!");
    } else {
      throw new Error("Password is not valid");
    }
  } catch (error) {
    res.status(401).send({ message: "Error" } + error.message);
  }
});

router.post("/logout", userAuth, async (req, res) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
  });
  res.status(200).send({ message: "Successfully Logout" });
});

module.exports = router;
