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

// gets the data for the items in grocery list for user and sends info back
  app.get("/members/getgroceries2", isAuthenticated, function(req, res) {
    db.User.findById(req.user.id)
    .then(function(user) {
      user.getGroceries()
      .then(function(groceries) {
        res.json(groceries);
      });
    });
  });
  
  //updates the item to owned
    app.put("/members/updategroceries", isAuthenticated, function(req, res) {
      db.Grocery.update({
        ownedItem: true
      }, {
        where: {
          Id: parseInt(req.body.id)
        }
      }).then(function(){
        res.end();
      })
    });


  app.get("/members/addgroceries", isAuthenticated, function(req, res) {
    res.sendFile(path.join(__dirname, "../public/grocery.html"));
  });
  
  app.post("/members/addgroceries", isAuthenticated, function(req, res) {
    if(req.body.notification) {
      var notification = req.body.notification;
    }else if(req.body.date) {
      var notification = (Date.parse(req.body.date) - 604800000);
    }
    db.Grocery.create({
      foodProduct: req.body.name,
      quantity: req.body.quantity,
      quantityUnit: req.body.unit,
      expirationDate: req.body.date || null,
      expirationNotification: notification || null,
      ownedItem: req.body.owned,
      UserId: req.user.id
    })
    .then(function(grocery) {
      res.redirect("/members");
    });
  });

};