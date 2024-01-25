'use strict';
const bcrypt = require('bcryptjs')
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasOne(models.Profile)
      User.hasMany(models.Post)
    }

  }
  User.init({
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {msg: 'Username is required'},
        notEmpty: {msg: 'Username is required'}
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {msg: 'Email is required'},
        notEmpty: {msg: 'Email is required'},
        isEmail: {msg: 'Wrong Email Format'}
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {msg: 'Password is required'},
        notEmpty: {msg: 'Password is required'}
      }
    },
    role: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'User',
    hooks : {
      beforeCreate (User) {
        let salt = bcrypt.genSaltSync(8)
        let hash = bcrypt.hashSync(User.password, salt)
        User.password = hash
        User.role = 'user'
      }
    }
  });
  return User;
};