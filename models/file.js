module.exports = (sequelize, DataTypes) => {
    return sequelize.define('File', {
      filename: DataTypes.STRING,
      uploadDate: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      }
    });
  };
  