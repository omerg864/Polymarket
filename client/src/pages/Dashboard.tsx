import { usePositionsByWalletQuery } from '@/api/position.api';
import { useWalletsQuery } from '@/api/wallet.api';
import PageTitle from '@/components/layout/PageTitle';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CLIENT_ROUTES } from '@shared/constants/routes.constants';
import { BarChart3, Wallet } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';

export default function Dashboard() {
	const { t } = useTranslation('dashboard');
	const { data: wallets = [] } = useWalletsQuery();

	// Fetch positions for all wallets
	const walletIds = wallets.map((w) => w.id);
	const firstWalletId = walletIds[0];
	const { data: positions = [] } = usePositionsByWalletQuery(firstWalletId);

	return (
		<div className="flex flex-col gap-6">
			<PageTitle title={t('title')} />

			<div className="grid gap-4 md:grid-cols-2">
				<Card className="border-none shadow-md">
					<CardHeader className="flex flex-row items-center justify-between pb-2">
						<CardTitle className="text-sm font-medium text-slate-500">
							{t('totalWallets')}
						</CardTitle>
						<Wallet className="h-4 w-4 text-slate-400" />
					</CardHeader>
					<CardContent>
						<div className="text-3xl font-bold">
							{wallets.length}
						</div>
					</CardContent>
				</Card>

				<Card className="border-none shadow-md">
					<CardHeader className="flex flex-row items-center justify-between pb-2">
						<CardTitle className="text-sm font-medium text-slate-500">
							{t('totalPositions')}
						</CardTitle>
						<BarChart3 className="h-4 w-4 text-slate-400" />
					</CardHeader>
					<CardContent>
						<div className="text-3xl font-bold">
							{positions.length}
						</div>
					</CardContent>
				</Card>
			</div>

			{wallets.length === 0 ? (
				<Card className="border-none shadow-md">
					<CardContent className="flex flex-col items-center justify-center py-12 text-center">
						<Wallet className="mb-4 h-12 w-12 text-slate-300" />
						<p className="text-sm text-slate-500">
							{t('addWalletPrompt')}
						</p>
						<Link
							to={CLIENT_ROUTES.WALLETS}
							className="mt-4 inline-flex items-center rounded-md bg-slate-900 px-4 py-2 text-sm text-white hover:bg-slate-800"
						>
							{t('totalWallets')}
						</Link>
					</CardContent>
				</Card>
			) : (
				<Card className="border-none shadow-md">
					<CardHeader>
						<CardTitle className="text-lg">
							{t('recentPositions')}
						</CardTitle>
					</CardHeader>
					<CardContent>
						{positions.length === 0 ? (
							<p className="text-sm text-slate-500 py-4 text-center">
								{t('noPositions')}
							</p>
						) : (
							<div className="space-y-3">
								{positions.slice(0, 5).map((pos) => (
									<div
										key={pos.id}
										className="flex items-center justify-between rounded-lg bg-slate-50 p-3"
									>
										<div>
											<p className="text-sm font-medium">
												{pos.title || pos.conditionId}
											</p>
											<p className="text-xs text-slate-500">
												{pos.stance}
											</p>
										</div>
										<div className="text-right">
											<p className="text-sm font-semibold">
												{pos.size}
											</p>
											{pos.avgPrice != null && (
												<p className="text-xs text-slate-400">
													${pos.avgPrice.toFixed(2)}
												</p>
											)}
										</div>
									</div>
								))}
							</div>
						)}
					</CardContent>
				</Card>
			)}
		</div>
	);
}
