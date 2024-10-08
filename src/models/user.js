'use strict';

const { Model } = require('sequelize');


module.exports = (sequelize, DataTypes) => {

  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // User.belongsTo(models.AllCode)
      // User.belongsTo(models.AllCode)

      // User.belongsTo(models.AllCode, {sourceKey: 'positionId', targetKey:'keyMap', as:'positionData' })
      // User.belongsTo(models.AllCode, {sourceKey: 'gender', targetKey:'keyMap', as:'genderData' })

      User.belongsTo(models.AllCode, {foreignKey: 'positionId', targetKey:'keyMap',as: 'positionData' , })
      User.belongsTo(models.AllCode,{foreignKey: 'gender', targetKey:'keyMap', as: 'genderData', })
      User.hasOne(models.Markdown,{foreignKey: 'doctorId'})
      User.hasOne(models.DoctorInfo,{foreignKey: 'doctorId'})

      User.hasMany(models.Schedule,{foreignKey: 'doctorId', as: 'doctorData', })
      User.hasMany(models.Booking,{foreignKey: 'patientId', as: 'patientData', })
    }
  }
  User.init({
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    address: DataTypes.STRING,
    phoneNumber: DataTypes.STRING,
    gender: DataTypes.STRING,
    roleId: DataTypes.STRING,
    positionId: DataTypes.STRING,
    image: DataTypes.BLOB('long'),
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};