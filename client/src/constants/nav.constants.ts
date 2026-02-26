import { CLIENT_ROUTES } from '@shared/constants/routes.constants';
import type { TFunction } from 'i18next';
import { BarChart3, Settings, Wallet } from 'lucide-react';

export const getNavItems = (t: TFunction<'nav'>) => [
	{
		to: CLIENT_ROUTES.HOME,
		icon: BarChart3,
		label: t('dashboard'),
	},
	{
		to: CLIENT_ROUTES.WALLETS,
		icon: Wallet,
		label: t('wallets'),
	},
];

export const getSecondaryNavItems = (t: TFunction<'nav'>) => [
	{
		to: '/settings',
		icon: Settings,
		label: t('settings'),
	},
];
