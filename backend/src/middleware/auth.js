const adminAuth = (req, res, next) => {
  console.log("Admin auth is getting started");

  const token = "xyz";

  const isAdmin = token === "xyz";

  if (!isAdmin) {
    res.status(401).send("Authentication is not valid");
  } else {
    next();
  }
};

module.exports = { adminAuth };
