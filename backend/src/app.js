const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();

const connectDB = require("./config/database");
const { Error } = require("mongoose");

app.use(express.json());
app.use(cookieParser());

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);

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
