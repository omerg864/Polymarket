import { Button } from '@/components/ui/button';
import { CLIENT_ROUTES } from '@shared/constants/routes.constants';
import { BarChart3, Bell, Wallet } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';

export default function Home() {
	const { t } = useTranslation('home');

	return (
		<div className="flex min-h-screen flex-col">
			<header className="flex items-center justify-between px-6 py-4">
				<h1 className="text-xl font-bold text-slate-900">
					{t('header.title')}
				</h1>
				<div className="flex gap-2">
					<Link to={CLIENT_ROUTES.LOGIN}>
						<Button variant="ghost" size="sm">
							{t('hero.logIn')}
						</Button>
					</Link>
					<Link to={CLIENT_ROUTES.REGISTER}>
						<Button size="sm">{t('hero.getStarted')}</Button>
					</Link>
				</div>
			</header>

			<main className="flex flex-1 flex-col items-center justify-center px-6 text-center">
				<h2 className="mb-4 text-4xl font-bold tracking-tight text-slate-900 md:text-5xl">
					{t('hero.title')}
				</h2>
				<p className="mb-8 max-w-lg text-lg text-slate-500">
					{t('hero.description')}
				</p>
				<div className="flex gap-3">
					<Link to={CLIENT_ROUTES.REGISTER}>
						<Button size="lg">{t('hero.getStarted')}</Button>
					</Link>
					<Link to={CLIENT_ROUTES.LOGIN}>
						<Button variant="outline" size="lg">
							{t('hero.logIn')}
						</Button>
					</Link>
				</div>

				<div className="mt-16 grid gap-8 md:grid-cols-3">
					<div className="flex flex-col items-center gap-2">
						<div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
							<Wallet className="h-6 w-6 text-slate-700" />
						</div>
						<h3 className="font-semibold text-slate-900">
							{t('features.walletTracking.title')}
						</h3>
						<p className="text-sm text-slate-500">
							{t('features.walletTracking.description')}
						</p>
					</div>
					<div className="flex flex-col items-center gap-2">
						<div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
							<BarChart3 className="h-6 w-6 text-slate-700" />
						</div>
						<h3 className="font-semibold text-slate-900">
							{t('features.positionAlerts.title')}
						</h3>
						<p className="text-sm text-slate-500">
							{t('features.positionAlerts.description')}
						</p>
					</div>
					<div className="flex flex-col items-center gap-2">
						<div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
							<Bell className="h-6 w-6 text-slate-700" />
						</div>
						<h3 className="font-semibold text-slate-900">
							{t('features.emailNotifications.title')}
						</h3>
						<p className="text-sm text-slate-500">
							{t('features.emailNotifications.description')}
						</p>
					</div>
				</div>
			</main>

			<footer className="py-6 text-center text-xs text-slate-400">
				{t('footer.rightsReserved')}
			</footer>
		</div>
	);
}
