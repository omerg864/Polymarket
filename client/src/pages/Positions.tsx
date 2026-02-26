import { usePositionsByWalletQuery } from '@/api/position.api';
import { useWalletsQuery } from '@/api/wallet.api';
import PageTitle from '@/components/layout/PageTitle';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { BarChart3, RefreshCw } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router';

export default function Positions() {
	const { t } = useTranslation('positions');
	const [searchParams] = useSearchParams();
	const walletId = searchParams.get('walletId') || undefined;
	const { data: wallets = [] } = useWalletsQuery();
	const {
		data: positions = [],
		isLoading,
		isFetching,
		refetch,
	} = usePositionsByWalletQuery(walletId);

	const wallet = wallets.find((w) => w.id === walletId);

	return (
		<div className="flex flex-col gap-6">
			<div className="flex items-center justify-between">
				<PageTitle
					title={
						wallet
							? `${t('title')} — ${wallet.label || wallet.address}`
							: t('title')
					}
				/>
				{walletId && (
					<Button
						variant="outline"
						size="icon"
						onClick={() => refetch()}
						disabled={isFetching}
					>
						<RefreshCw
							className={cn(
								'h-4 w-4',
								isFetching && 'animate-spin',
							)}
						/>
					</Button>
				)}
			</div>

			{!walletId ? (
				<Card className="border-none shadow-md">
					<CardContent className="py-12 text-center text-sm text-slate-500">
						{t('selectWallet')}
					</CardContent>
				</Card>
			) : isLoading ? (
				<div className="flex justify-center py-12">
					<div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-300 border-t-slate-900" />
				</div>
			) : positions.length === 0 ? (
				<Card className="border-none shadow-md">
					<CardContent className="flex flex-col items-center justify-center py-16 text-center">
						<BarChart3 className="mb-4 h-16 w-16 text-slate-300" />
						<h3 className="text-lg font-semibold text-slate-700">
							{t('noPositionsFound')}
						</h3>
						<p className="mt-1 text-sm text-slate-500">
							{t('waitingForSync')}
						</p>
					</CardContent>
				</Card>
			) : (
				<div className="space-y-3">
					{positions.map((pos) => (
						<Card key={pos.id} className="border-none shadow-md">
							<CardHeader className="pb-2">
								<CardTitle className="text-sm font-semibold">
									{pos.title || pos.conditionId}
								</CardTitle>
								{pos.marketSlug && (
									<a
										href={`https://polymarket.com/event/${pos.marketSlug}`}
										target="_blank"
										rel="noopener noreferrer"
										className="text-xs text-blue-500 hover:underline"
									>
										{t('market')} ↗
									</a>
								)}
							</CardHeader>
							<CardContent>
								<div className="flex flex-wrap items-center gap-4 text-sm">
									<div>
										<span className="text-slate-500">
											{t('stance')}:{' '}
										</span>
										<span
											className={cn(
												'font-semibold',
												pos.stance === 'Yes'
													? 'text-green-600'
													: 'text-red-500',
											)}
										>
											{pos.stance}
										</span>
									</div>
									{pos.outcome && (
										<div>
											<span className="text-slate-500">
												{t('outcome')}:{' '}
											</span>
											<span className="font-semibold">
												{pos.outcome}
											</span>
										</div>
									)}
									<div>
										<span className="text-slate-500">
											{t('size')}:{' '}
										</span>
										<span className="font-semibold">
											{pos.size}
										</span>
									</div>
									{pos.avgPrice != null && (
										<div>
											<span className="text-slate-500">
												{t('avgPrice')}:{' '}
											</span>
											<span className="font-semibold">
												${pos.avgPrice.toFixed(2)}
											</span>
										</div>
									)}
									{pos.size === 0 && (
										<span className="rounded-full bg-slate-200 px-2 py-0.5 text-xs font-medium text-slate-600">
											{t('closed')}
										</span>
									)}
								</div>
							</CardContent>
						</Card>
					))}
				</div>
			)}
		</div>
	);
}
