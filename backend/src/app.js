const express = require("express");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");

const app = express();

const connectDB = require("./config/database");
const User = require("./models/user");

const { validateSignUpData } = require("./utils/validate");
const { userAuth } = require("./middleware/auth");
const { Error } = require("mongoose");

app.use(express.json());
app.use(cookieParser());

// signup
app.post("/signup", async (req, res) => {
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

//profile

app.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user;

    if (!user) {
      throw new Error("No User Found");
    }
    res.status(200).send(user);
  } catch (error) {}
});

// login

app.post("/login", async (req, res) => {
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
    res.status(400).send("Error", error.message);
  }
});

app.post("/sendConnectionRequest", userAuth, async (req, res) => {
  console.log("Sending a Connection request");
  res.status(200).send("Connection Request send");
});

connectDB()
  .then(() => {
    console.log("Database connection establish");
    app.listen(3002, () => {
      console.log("Server is successfully on port 3000");
    });
  })
  .catch((err) => {
    console.err("Database cannot be connected ");
  });
