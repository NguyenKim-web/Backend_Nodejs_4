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