import { z } from 'zod';
// import selectionSchema from '.';

const lineStatusSchema = z.strictObject({
	status: z.enum(['attributed', 'in-progress', 'resiliated'], {
		errorMap: () => {
			return {
				message:
					'Le statut doit être attributed, in-progress ou resiliated',
			};
		},
	}),
});

export default lineStatusSchema;
