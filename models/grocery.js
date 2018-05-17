module.exports = function(sequelize, DataTypes) {
    var Grocery = sequelize.define("Grocery", {
      foodProduct: DataTypes.STRING,
      quantity: DataTypes.DOUBLE,
      quantityUnit: DataTypes.STRING,
      expirationDate: DataTypes.DATE,
      expirationNotification: DataTypes.DATE
    });
    Grocery.associate = function(models) {
      models.Grocery.belongsTo(models.User);
    };
    // Grocery.getExpirationStatus will return 0, 1, or 2 and then you can use that to display it in the proper section of the html page
    Grocery.prototype.getExpirationStatus = function() {
      var today = Date.now();
      if(today >= this.expirationDate) {
        return 2;
      }else if(today >= this.expirationNotification) {
        return 1;
      }else{
        return 0;
      }
    };
    return Grocery;
  };