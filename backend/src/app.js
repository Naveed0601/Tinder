const express = require("express");

const app = express();

app.use((req, res) => {
  res.send("hello from the server");
});

app.listen(3002, () => {
  console.log("Server is successfully on port 3000");
});
