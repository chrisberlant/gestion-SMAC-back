import { Sequelize } from 'sequelize';

const sequelize = new Sequelize(process.env.PG_URL!, {
	define: {
		timestamps: false,
		underscored: true,
	},
	logging: console.log,
});

export default sequelize;
