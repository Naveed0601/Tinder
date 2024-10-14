const express = require("express");
const router = express.Router();
const { userAuth } = require("../middleware/auth");

router.post("/sendConnectionRequest", userAuth, async (req, res) => {
  console.log("Sending a Connection request");
  res.status(200).send("Connection Request send");
});

module.exports = router;
