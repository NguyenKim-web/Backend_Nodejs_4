'use strict';
import User from './user'
import db from './index';
const { Model } = require('sequelize');


module.exports = (sequelize, DataTypes) => {

  class AllCode extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // AllCode.hasMany(models.User)
      // AllCode.hasMany(models.User, { sourceKey: 'keyMap', foreignKey: 'positionId'})


      // AllCode.hasMany(models.User, { foreignKey: 'gender', as:'genderData'})

      // AllCode.hasMany(models.User, { foreignKey: 'positionId',  as:'positionData',})
      // AllCode.hasMany(models.User, { foreignKey: 'gender',  as:'genderData', }) 
      
      AllCode.hasMany(models.User, { as:'positionData',foreignKey: 'positionId' })
      AllCode.hasMany(models.User, { as:'genderData' ,foreignKey: 'gender' })
      AllCode.hasMany(models.Schedule, { as:'timeTypeData' ,foreignKey: 'timeType' })
      
      AllCode.hasMany(models.DoctorInfo, { foreignKey:'priceId' ,as: 'priceData' })
      AllCode.hasMany(models.DoctorInfo, { foreignKey:'provinceId' ,as: 'provinceData' })
      AllCode.hasMany(models.DoctorInfo, { foreignKey:'paymentId' ,as: 'paymentData' })
      AllCode.hasMany(models.Booking, { foreignKey:'timeType' ,as: 'timeData' })
    }
  }
  AllCode.init({
    keyMap: DataTypes.STRING,
    type: DataTypes.STRING,
    valueEn: DataTypes.STRING,
    valueVi: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'AllCode',
  });
  return AllCode;
};