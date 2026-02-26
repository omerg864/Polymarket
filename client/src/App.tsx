import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { lazy, Suspense, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Route, Routes } from 'react-router';
import { Toaster } from 'sonner';
import { Loader } from './components/custom/Loader.tsx';
import NetworkBanner from './components/custom/NetworkBanner.tsx';
import AuthenticatedRoute from './components/routes/AuthenticatedRoute.tsx';
import { useDir } from './hooks/useDir';
import { authClient } from './lib/clients/auth.client';
import { idbPersister } from './lib/clients/idb.client';
import queryClient from './lib/clients/query.client';
import { setZodLocale } from './lib/utils/zod.utils.ts';
import { useAuthStore } from './stores/useAuthStore.ts';

const Home = lazy(() => import('./pages/Home'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const ResetPassword = lazy(() => import('./pages/ResetPassword'));
const VerifyEmail = lazy(() => import('./pages/VerifyEmail'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Wallets = lazy(() => import('./pages/Wallets'));
const Positions = lazy(() => import('./pages/Positions'));
const Settings = lazy(() => import('./pages/Settings'));
const Profile = lazy(() => import('./pages/Profile'));

function App() {
	const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
	const { i18n } = useTranslation();
	const dir = useDir();

	useEffect(() => {
		setZodLocale(i18n.language);
		document.dir = dir;
	}, [i18n, dir]);

	useEffect(() => {
		const checkSession = async () => {
			const { data } = await authClient.getSession();
			if (data?.user) {
				useAuthStore.getState().setAuthenticated();
			} else {
				useAuthStore.getState().removeAuthenticated();
			}
		};
		void checkSession();
	}, [isAuthenticated]);

	return (
		<PersistQueryClientProvider
			client={queryClient}
			persistOptions={{
				persister: idbPersister,
				maxAge: 1000 * 60 * 60 * 2,
			}}
		>
			<NetworkBanner />
			<Toaster position="top-center" />
			<Suspense fallback={<Loader />}>
				<main className="flex h-full overflow-auto flex-col bg-slate-50 dark:bg-slate-950">
					<Routes>
						{!isAuthenticated && (
							<Route path="/" element={<Home />} />
						)}
						{isAuthenticated && (
							<Route element={<AuthenticatedRoute />}>
								<Route path="/" element={<Dashboard />} />
							</Route>
						)}
						<Route path="/login" element={<Login />} />
						<Route path="/register" element={<Register />} />
						<Route
							path="/forgot-password"
							element={<ForgotPassword />}
						/>
						<Route
							path="/reset-password"
							element={<ResetPassword />}
						/>
						<Route path="/verify-email" element={<VerifyEmail />} />
						<Route element={<AuthenticatedRoute />}>
							<Route path="/wallets" element={<Wallets />} />
							<Route path="/positions" element={<Positions />} />
							<Route
								path="/settings/profile"
								element={<Profile />}
							/>
							<Route path="/settings" element={<Settings />} />
						</Route>
					</Routes>
				</main>
			</Suspense>
		</PersistQueryClientProvider>
	);
}

export default App;
