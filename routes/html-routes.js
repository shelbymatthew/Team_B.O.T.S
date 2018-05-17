// Requiring path to so we can use relative routes to our HTML files
var path = require("path");

// Requiring our custom middleware for checking if a user is logged in
var isAuthenticated = require("../config/middleware/isAuthenticated");

module.exports = function(app, db) {

  app.get("/register", function(req, res) {
    // If the user already has an account send them to the members page
    if (req.user) {
      res.redirect("/members");
    }
    res.sendFile(path.join(__dirname, "../public/signup.html"));
  });

  app.get("/login", function(req, res) {
    // If the user already has an account send them to the members page
    if (req.user) {
      res.redirect("/members");
    }
    res.sendFile(path.join(__dirname, "../public/login.html"));
  });

  // Here we've add our isAuthenticated middleware to this route.
  // If a user who is not logged in tries to access this route they will be redirected to the signup page
  app.get("/members", isAuthenticated, function(req, res) {
    res.sendFile(path.join(__dirname, "../public/members.html"));
  });

  app.get("/members/getgroceries", isAuthenticated, function(req, res) {
    db.User.findById(req.user.id)
    .then(function(user) {
      user.getGroceries()
      .then(function(groceries) {
        res.send(groceries);
      });
    });
  });

  app.get("/members/addgroceries", isAuthenticated, function(req, res) {
    res.sendFile(path.join(__dirname, "../public/grocery.html"));
  });

  app.post("/members/addgroceries", isAuthenticated, function(req, res) {
    db.Grocery.create({
      foodProduct: req.body.name,
      quantity: req.body.quantity,
      UserId: req.user.id
    })
    .then(function(grocery) {
      res.redirect("/members");
    });
  });

};