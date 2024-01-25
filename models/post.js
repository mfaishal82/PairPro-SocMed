'use strict';
const {dateLocalFormat} = require('../helper/formater')

const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Post extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Post.belongsTo(models.User)
      Post.hasMany(models.TagPost)
    }
    get formatLocalDate(){
      return dateLocalFormat(this.createdAt)
    }
  }
  Post.init({
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {msg: 'Title is require.'},
        notEmpty: {msg: 'Title is require.'}
      }
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notNull: {msg: 'Content is require.'},
        notEmpty: {msg: 'Content is require.'}
      }
    },
    imgUrl: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {msg: 'Image Url is require.'},
        notEmpty: {msg: 'Image Url is require.'}
      }
    },
    UserId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Post',
  });
  return Post;
};