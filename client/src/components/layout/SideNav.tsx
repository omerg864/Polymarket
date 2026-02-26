import { getNavItems, getSecondaryNavItems } from '@/constants/nav.constants';
import { useDir } from '@/hooks/useDir';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router';

export default function SideNav() {
	const { t } = useTranslation('nav');
	const dir = useDir();

	const navItems = getNavItems(t);
	const secondaryNavItems = getSecondaryNavItems(t);

	return (
		<div
			className={cn(
				'fixed bottom-4 top-4 z-50 flex w-20 flex-col items-center justify-between rounded-2xl bg-[#1c1c1e]/90 py-6 text-white shadow-2xl backdrop-blur-xl transition-all',
				dir === 'rtl' ? 'right-4' : 'left-4',
			)}
		>
			<div className="flex flex-col gap-6">
				<div className="flex flex-col gap-2">
					{navItems.map((item) => (
						<NavLink
							key={item.to}
							to={item.to}
							className={({ isActive }) =>
								cn(
									'group flex h-10 w-10 items-center justify-center rounded-xl transition-all hover:bg-white/10',
									isActive &&
										'bg-white text-black hover:bg-white',
								)
							}
						>
							<item.icon className="h-5 w-5" />
						</NavLink>
					))}
				</div>
			</div>

			<div className="flex flex-col gap-2">
				{secondaryNavItems.map((item) => (
					<NavLink
						key={item.to}
						to={item.to}
						className={({ isActive }) =>
							cn(
								'group flex h-10 w-10 items-center justify-center rounded-xl transition-all hover:bg-white/10',
								isActive &&
									'bg-white text-black hover:bg-white',
							)
						}
					>
						<item.icon className="h-5 w-5" />
					</NavLink>
				))}
			</div>
		</div>
	);
}
