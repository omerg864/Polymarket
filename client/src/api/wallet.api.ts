import { API_ROUTES } from '@shared/constants/routes.constants';
import type { WalletEntity } from '@shared/types/wallet.type';
import { generateLink } from '@shared/utils/route.utils';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from '../lib/clients/axios.client';

export const useWalletsQuery = () => {
	return useQuery({
		queryKey: [API_ROUTES.WALLET.BASE],
		queryFn: async () => {
			const { data } = await axios.get<WalletEntity[]>(
				generateLink({
					route: [API_ROUTES.WALLET.BASE, API_ROUTES.WALLET.FIND_ALL],
				}),
			);
			return data;
		},
	});
};

export const useWalletQuery = (id: string) => {
	return useQuery({
		queryKey: [API_ROUTES.WALLET.BASE, id],
		queryFn: async () => {
			const { data } = await axios.get<WalletEntity>(
				generateLink({
					route: [API_ROUTES.WALLET.BASE, API_ROUTES.WALLET.FIND_ONE],
					params: { id },
				}),
			);
			return data;
		},
		enabled: !!id,
	});
};

export const useCreateWalletMutation = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (data: { address: string; label?: string }) => {
			const res = await axios.post<WalletEntity>(
				generateLink({
					route: [API_ROUTES.WALLET.BASE, API_ROUTES.WALLET.CREATE],
				}),
				data,
			);
			return res.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: [API_ROUTES.WALLET.BASE],
			});
		},
	});
};

export const useUpdateWalletMutation = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async ({
			id,
			data,
		}: {
			id: string;
			data: { label?: string };
		}) => {
			const res = await axios.patch<WalletEntity>(
				generateLink({
					route: [API_ROUTES.WALLET.BASE, API_ROUTES.WALLET.UPDATE],
					params: { id },
				}),
				data,
			);
			return res.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: [API_ROUTES.WALLET.BASE],
			});
		},
	});
};

export const useDeleteWalletMutation = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (id: string) => {
			const res = await axios.delete<WalletEntity>(
				generateLink({
					route: [API_ROUTES.WALLET.BASE, API_ROUTES.WALLET.DELETE],
					params: { id },
				}),
			);
			return res.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: [API_ROUTES.WALLET.BASE],
			});
		},
	});
};
