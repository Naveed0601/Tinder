const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://Naveed:abdulnaveed@cluster.yti3g.mongodb.net/?retryWrites=true&w=majority&appName=Cluster"
  );
};

module.exports = connectDB;
