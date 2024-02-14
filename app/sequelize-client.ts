import { Sequelize } from 'sequelize';

const sequelize = new Sequelize(process.env.PG_URL!, {
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
