import { z } from 'zod';

export const CreateWalletSchema = z.object({
	address: z.string().min(1, { error: 'Wallet address is required' }),
	label: z.string().max(100).optional(),
});

export const UpdateWalletSchema = z.object({
	label: z.string().max(100).optional(),
});
