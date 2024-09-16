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
      DoctorInfo.belongsTo(models.User,{foreignKey: 'doctorId'});
      DoctorInfo.belongsTo(models.AllCode, { foreignKey:'priceId' ,targetKey: 'keyMap', as: 'priceData' });
      DoctorInfo.belongsTo(models.AllCode, { foreignKey:'provinceId' ,targetKey: 'keyMap', as: 'provinceData' });
      DoctorInfo.belongsTo(models.AllCode, { foreignKey:'paymentId' ,targetKey: 'keyMap', as: 'paymentData' });
    }
  }
  DoctorInfo.init({
    doctorId: DataTypes.INTEGER,
    specialtyId: DataTypes.INTEGER,
    clinicId: DataTypes.INTEGER,
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
    freezeTableName: true
  });
  return DoctorInfo;
};