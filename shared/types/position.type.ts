export type PositionEntity = {
	id: string;
	walletId: string;
	conditionId: string;
	marketSlug?: string;
	title?: string;
	stance: string;
	outcome?: string;
	size: number;
	avgPrice?: number;
	notified: boolean;
	createdAt: Date;
	updatedAt: Date;
};
