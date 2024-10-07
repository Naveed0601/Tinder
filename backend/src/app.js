const express = require("express");

const app = express();

app.get("/user", (req, res) => {
  res.send({ firstname: "Mohd", lastname: "Naveed" });
});

app.post("/user", (req, res) => {
  res.send("Data Successfully saved to the database");
});

app.delete("/user", (req, res) => {
  res.send("Deleted Successfully");
});

app.listen(3002, () => {
  console.log("Server is successfully on port 3000");
});
