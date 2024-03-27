import { Model } from 'sequelize';
import util from 'util';

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
export const compareStoredAndReceivedValues = (
	storedValue: Model<any, any>,
	receivedValue: object
) => util.isDeepStrictEqual(storedValue.dataValues, receivedValue);
