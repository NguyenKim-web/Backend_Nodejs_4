'use strict';

const { Model } = require('sequelize');


module.exports = (sequelize, DataTypes) => {

  class DoctorInfo extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // DoctorInfo.belongsTo(models.AllCode)
      // DoctorInfo.belongsTo(models.AllCode)

      // DoctorInfo.belongsTo(models.AllCode, {sourceKey: 'positionId', targetKey:'keyMap', as:'positionData' })
      // DoctorInfo.belongsTo(models.AllCode, {sourceKey: 'gender', targetKey:'keyMap', as:'genderData' })

    //   DoctorInfo.belongsTo(models.AllCode, {foreignKey: 'positionId', targetKey:'keyMap',as: 'positionData' , })
    //   DoctorInfo.belongsTo(models.AllCode,{foreignKey: 'gender', targetKey:'keyMap', as: 'genderData', })
    //   DoctorInfo.hasOne(models.Markdown,{foreignKey: 'doctorId'})
    // }
  }
  DoctorInfo.init({
    doctorId: DataTypes.INTEGER,
    priceId: DataTypes.STRING,
    provinceId: DataTypes.STRING,
    paymentId: DataTypes.STRING,
    clinicAddress: DataTypes.STRING,
    clinicName: DataTypes.STRING,
    note: DataTypes.STRING,
    count: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'DoctorInfo',
  });
  return DoctorInfo;
};