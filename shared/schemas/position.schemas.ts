import { z } from 'zod';

export const CreatePositionSchema = z.object({
	walletId: z.string().min(1),
	conditionId: z.string().min(1),
	marketSlug: z.string().optional(),
	title: z.string().optional(),
	outcome: z.string().min(1),
	size: z.number(),
	avgPrice: z.number().optional(),
});
