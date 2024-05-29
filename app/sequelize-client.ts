import { Sequelize } from 'sequelize';
import * as pg from 'pg';

const sequelize = new Sequelize(process.env.PG_URL!, {
	dialectModule: pg,
	define: {
		timestamps: false,
		underscored: true,
	},
	pool: {
		max: 5,
		min: 0,
		acquire: 30000,
		idle: 10000,
	},
	logging: console.log,
});

export default sequelize;
