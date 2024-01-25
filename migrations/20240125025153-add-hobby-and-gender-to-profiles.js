'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.addColumn('Profiles', 'hobby', {
      type: Sequelize.STRING
    })

    await queryInterface.addColumn('Profiles', 'gender', {
      type: Sequelize.STRING      
    })

    await queryInterface.addColumn('Profiles', 'organization', {
      type: Sequelize.STRING      
    })
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.removeColumn('Profiles', 'hobby')
    await queryInterface.removeColumn('Profiles', 'gender')
    await queryInterface.removeColumn('Profiles', 'organization')
  }
};
