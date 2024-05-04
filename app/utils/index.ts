import { Model } from 'sequelize';

// Convertit une string contenant une date en format date utilisable en BDD
export const convertToDate = (dateString: string) => {
	// Si date au format US
	if (
		/^\d{4}-\d{2}-\d{2}$/.test(dateString) ||
		/^\d{4}\/\d{2}\/\d{2}$/.test(dateString)
	) {
		return new Date(dateString);
	}
	// Si date au format FR
	if (
		/^\d{2}-\d{2}-\d{4}$/.test(dateString) ||
		/^\d{2}\/\d{2}\/\d{4}$/.test(dateString)
	) {
		const [day, month, year] = dateString.split('/').map(Number);
		return new Date(year, month - 1, day);
	}
	// Sinon renvoyer la string telle quelle
	return dateString;
};

// Comparer les valeurs stockées en BDD avec celles envoyées par le client
export const receivedDataIsAlreadyExisting = (
	storedValue: Model<any, any>,
	receivedValue: { [key: string]: any }
) => {
	const storedDataValues = storedValue.dataValues;

	// Vérifie si toutes les propriétés reçues sont incluses dans le modèle stocké en BDD
	for (const key in receivedValue) {
		if (!(key in storedDataValues)) return false;
		// Vérifie si les valeurs sont égales
		if (receivedValue[key] !== storedDataValues[key]) {
			return false;
		}
	}

	return true;
};
