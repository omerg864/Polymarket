import { getNavItems, getSecondaryNavItems } from '@/constants/nav.constants';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router';

export default function BottomNav() {
	const { t } = useTranslation('nav');

	const navItems = getNavItems(t);
	const secondaryNavItems = getSecondaryNavItems(t);

	return (
		<div className="fixed bottom-4 left-4 right-4 z-50 rounded-2xl bg-white p-2 shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
			<div className="flex items-center justify-between px-2">
				{[...navItems, ...secondaryNavItems].map((item) => (
					<NavLink
						key={item.to}
						to={item.to}
						className={({ isActive }) =>
							cn(
								'flex flex-col items-center gap-1 p-2 text-gray-400 transition-colors hover:text-gray-900 w-15',
								isActive && 'text-gray-900',
							)
						}
					>
						{({ isActive }) => (
							<>
								<div
									className={cn(
										'flex h-10 w-10 items-center justify-center rounded-full transition-all',
										isActive &&
											'bg-[#1c1c1e] text-white shadow-md',
									)}
								>
									<item.icon className="h-5 w-5" />
								</div>
								<span className="text-[10px] font-medium">
									{item.label}
								</span>
							</>
						)}
					</NavLink>
				))}
			</div>
		</div>
	);
}
