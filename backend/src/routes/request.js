const express = require("express");
const router = express.Router();
const { userAuth } = require("../middleware/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

// router.post("/request/send/:status/:toUserId", userAuth, async (req, res) => {
//   try {
//     const fromUserId = req.user._id;
//     const toUserId = req.params.toUserId;
//     const status = req.params.status;

//     const allowedStatus = ["ignored", "interested"];

//     if (!allowedStatus.includes(status)) {
//       res.status(400).json({ message: "Invalid Status type" + status });
//     }

//     const toUser = await User.findById(toUserId);
//     if (!toUser) {
//       return res.status(400).json({ message: "User not found" });
//     }

//     // if there is an existing ConnectionReqeust

//     const existConnectionRequest = await ConnectionRequest.findOne({
//       $or: [
//         { fromUserId: toUserId },
//         { fromUserId: toUserId, toUserId: fromUserId },
//       ],
//     });

//     if (existConnectionRequest) {
//       res.status(400).send({ messsage: "Connection request already exits" });
//     }

//     const connectionRequest = new ConnectionRequest({
//       fromUserId,
//       toUserId,
//       status,
//     });

//     const data = await connectionRequest.save();
//     res
//       .status(200)
//       .json({ message: "Connection request sent successfully", data });
//   } catch (error) {
//     res.status(400).json({ message: "Error: " + error.message });
//   }
// });

router.post("/request/send/:status/:toUserId", userAuth, async (req, res) => {
  try {
    const fromUserId = req.user._id;
    const toUserId = req.params.toUserId;
    const status = req.params.status;

    const allowedStatus = ["ignored", "interested"];

    if (!allowedStatus.includes(status)) {
      return res
        .status(400)
        .json({ message: "Invalid Status type: " + status });
    }

    const toUser = await User.findById(toUserId);
    if (!toUser) {
      return res.status(400).json({ message: "User not found" });
    }

    const existConnectionRequest = await ConnectionRequest.findOne({
      $or: [
        { fromUserId, toUserId },
        { fromUserId: toUserId, toUserId: fromUserId },
      ],
    });

    if (existConnectionRequest) {
      return res
        .status(400)
        .json({ message: "Connection request already exists" });
    }

    const connectionRequest = new ConnectionRequest({
      fromUserId,
      toUserId,
      status,
    });

    const data = await connectionRequest.save();
    return res
      .status(200)
      .json({ message: "Connection request sent successfully", data });
  } catch (error) {
    return res.status(400).json({ message: "Error: " + error.message });
  }
});

router.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    try {
      // validate the status

      const loggedInUser = req.user;
      const { status, requestId } = req.params;

      // Corrected allowedStatus array
      const allowedStatus = ["accepted", "rejected"];
      if (!allowedStatus.includes(status)) {
        return res
          .status(400)
          .json({ message: "Status is not allowed: " + status });
      }

      const connectionRequest = await ConnectionRequest.findOne({
        _id: requestId,
        toUserId: loggedInUser._id,
        status: "interested",
      });

      if (!connectionRequest) {
        return res
          .status(404)
          .json({ message: "Connection request not found" });
      }

      connectionRequest.status = status;

      const data = await connectionRequest.save();

      res.status(200).json({ message: "Connection request " + status, data });
    } catch (error) {
      res.status(400).send("Error: " + error.message);
    }
  }
);

module.exports = router;
