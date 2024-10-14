const express = require("express");
const router = express.Router();
const { userAuth } = require("../middleware/auth");
const { validateEditProfileFields } = require("../utils/validate");

router.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;

    if (!user) {
      throw new Error("No User Found");
    }
    res.status(200).send(user);
  } catch (error) {}
});

router.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    if (!validateEditProfileFields(req)) {
      throw new Error("Invalid Edit Request");
    }
    const loggedInUser = req.user;
    console.log(loggedInUser);
    Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));
    console.log(loggedInUser);

    res.status(200).send("Successfully Edit your profile");
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});

module.exports = router;
