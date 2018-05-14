module.exports = function(sequelize, DataTypes) {
    var Grocery = sequelize.define("Grocery", {
      foodProduct: DataTypes.STRING,
      quantity: DataTypes.DOUBLE,
      expirationStatus: DataTypes.INTEGER,
      expirationDate: DataTypes.STRING,
      expirationNotification: DataTypes.STRING
    });
    return Grocery;
  };