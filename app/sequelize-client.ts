import { Sequelize } from 'sequelize';

const sequelize = new Sequelize(process.env.PG_URL!, {
	define: {
		timestamps: false,
		underscored: true,
	},
	logging: console.log,
	set: true, // Queries only update the fields provided
});

// This hook allows to trim all the data provided by the user before they are inserted into the DB
sequelize.addHook('beforeValidate', (instance) => {
	for (const key in instance.dataValues) {
		if (typeof instance.dataValues[key] === 'string') {
			instance.dataValues[key] = instance.dataValues[key].trim();
			// Every empty string will be considered as NULL
			if (instance.dataValues[key] === '')
				instance.dataValues[key] = null;
		}
	}
});

export default sequelize;
