module.exports = (sequelize, DataTypes) => {
    return sequelize.define('Block', {
      name: DataTypes.STRING,
      type: DataTypes.STRING,
      x: DataTypes.FLOAT,
      y: DataTypes.FLOAT,
      properties: DataTypes.JSON
    });
  };
  