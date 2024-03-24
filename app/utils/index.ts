// Convertit une date au format français DD/MM/YYYY en format date utilisable en BDD
export const convertToDate = (dateString: string) => {
	const [day, month, year] = dateString.split('/').map(Number);
	return new Date(year, month - 1, day);
};
