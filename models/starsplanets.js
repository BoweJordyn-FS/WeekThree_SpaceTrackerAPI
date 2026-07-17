'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
	class StarsPlanets extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// join table - no additional associations needed
		}
	}
	StarsPlanets.init(
		{
			id: {
				type: DataTypes.INTEGER,
				primaryKey: true,
				autoIncrement: true,
			},
			starId: DataTypes.INTEGER,
			planetId: DataTypes.INTEGER,
		},
		{
			sequelize,
			modelName: 'StarsPlanets',
		},
	);
	return StarsPlanets;
};
