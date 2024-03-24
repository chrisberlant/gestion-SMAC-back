import { Response } from 'express';
import { AsyncParser } from '@json2csv/node';

interface generateCsvFileProps {
	data: object;
	fileName: string;
	res: Response;
}

export default async function generateCsvFile({
	data,
	fileName,
	res,
}: generateCsvFileProps) {
	const datedFileName = `${fileName}_${Date.now()}.csv`;

	// Création du contenu CSV à partir des données
	const parser = new AsyncParser({ delimiter: ';', withBOM: true });
	const csv = await parser.parse(data).promise();

	// Ajout des en-têtes de la réponse
	res.setHeader('Access-Control-Expose-Headers', 'Content-Disposition');
	res.setHeader(
		'Content-Disposition',
		`attachment; filename=${datedFileName}`
	);

	return csv;
}
