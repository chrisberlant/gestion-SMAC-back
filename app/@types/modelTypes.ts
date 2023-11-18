import { z } from 'zod';
import { modelCreationSchema } from '../validationSchemas/modelSchemas.ts';

export type modelCreationType = z.infer<typeof modelCreationSchema>;
