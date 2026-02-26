import PageTitle from '@/components/layout/PageTitle';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { authClient } from '@/lib/clients/auth.client';
import queryClient from '@/lib/clients/query.client';
import { useAuthStore } from '@/stores/useAuthStore';
import { LogOut, User } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router';

export default function Settings() {
	const { t } = useTranslation('settings');
	const { t: tProfile } = useTranslation('profile');
	const navigate = useNavigate();

	const handleLogout = async () => {
		await authClient.signOut();
		useAuthStore.getState().removeAuthenticated();
		queryClient.clear();
		navigate('/');
	};

	return (
		<div className="flex flex-col gap-6">
			<PageTitle title={t('title')} />
			<div className="space-y-4">
				<Link to="/settings/profile">
					<Card className="border-none shadow-md cursor-pointer hover:shadow-lg transition-shadow">
						<CardHeader className="flex flex-row items-center gap-3 pb-2">
							<User className="h-5 w-5 text-slate-500" />
							<CardTitle className="text-sm font-medium">
								{tProfile('title')}
							</CardTitle>
						</CardHeader>
						<CardContent>
							<p className="text-xs text-slate-500">
								{tProfile('personalInfo')}
							</p>
						</CardContent>
					</Card>
				</Link>

				<Button
					variant="outline"
					className="w-full justify-start gap-2 text-red-500 hover:text-red-600"
					onClick={handleLogout}
				>
					<LogOut className="h-4 w-4" />
					{t('logOut')}
				</Button>
			</div>
		</div>
	);
}
