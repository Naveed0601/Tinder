const express = require("express");
const bcrypt = require("bcrypt");
const app = express();

const connectDB = require("./config/database");
const User = require("./models/user");

const { validateSignUpData } = require("./utils/validate");

app.use(express.json());

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

// login

app.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;

    const user = await User.findOne({ emailId: emailId });

    if (!user) {
      throw new Error("User Not Found");
    }
    console.log(password, user.password);
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (isPasswordValid) {
      res.send("Login Successfull!!");
    } else {
      throw new Error("Password is not valid");
    }
  } catch (error) {
    res.status(400).send("Error", error.message);
  }
});

// get user by email

app.get("/user", async (req, res) => {
  const userEmail = req.body.emailId;
  try {
    const user = await User.find({ emailId: userEmail });
    if (user.length === 0) {
      res.status(404).send("User Not Found");
    } else {
      res.status(200).send(user);
    }
  } catch (error) {
    res.status(400).send("SOmething went wrong");
  }
});

// Feed API - GET /feed  - get all the users from the database
app.get("/feed", async (req, res) => {
  try {
    const user = await User.find({});
    res.send(user);
  } catch (error) {
    res.status(400).send("SOmething went wrong");
  }
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
