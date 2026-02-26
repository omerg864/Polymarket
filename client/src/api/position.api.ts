import { API_ROUTES } from '@shared/constants/routes.constants';
import type { PositionEntity } from '@shared/types/position.type';
import { generateLink } from '@shared/utils/route.utils';
import { useQuery } from '@tanstack/react-query';
import axios from '../lib/clients/axios.client';

export const usePositionsByWalletQuery = (walletId: string | undefined) => {
	return useQuery({
		queryKey: [API_ROUTES.POSITION.BASE, walletId],
		queryFn: async () => {
			if (!walletId) return [];
			const { data } = await axios.get<PositionEntity[]>(
				generateLink({
					route: [
						API_ROUTES.POSITION.BASE,
						API_ROUTES.POSITION.FIND_BY_WALLET,
					],
					params: { walletId },
				}),
			);
			return data;
		},
		enabled: !!walletId,
	});
};

export const usePositionQuery = (id: string) => {
	return useQuery({
		queryKey: [API_ROUTES.POSITION.BASE, 'detail', id],
		queryFn: async () => {
			const { data } = await axios.get<PositionEntity>(
				generateLink({
					route: [
						API_ROUTES.POSITION.BASE,
						API_ROUTES.POSITION.FIND_ONE,
					],
					params: { id },
				}),
			);
			return data;
		},
		enabled: !!id,
	});
};
