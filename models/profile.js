'use strict';
const {dateLocalFormat} = require('../helper/formater')
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Profile extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Profile.belongsTo(models.User)
    }

    get formatDOB() {
      return this.dateOfBirth.toLocaleDateString('en-GB').split('/').reverse().join('-')
    }

    get fullName(){
      return `${this.firstName} ${this.lastName}`
    }

    formatedBirth(){
      return dateLocalFormat(this.dateOfBirth);
    }

    formatedCreated(){
      return dateLocalFormat(this.createdAt);
    }
  }
  Profile.init({
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'First name is required'},
        notNull: { msg: 'First name is required'}
      }
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Last name is required'},
        notNull: { msg: 'Last name is required'}
      }
    },
    dateOfBirth: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Date of Birth is required'},
        notNull: { msg: 'Date of Birth is required'},
      }
    },
    UserId: DataTypes.INTEGER,
    hobby: DataTypes.STRING,
    gender: DataTypes.STRING,
    organization: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Profile',
  });
  return Profile;
};