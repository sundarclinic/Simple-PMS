import React from 'react';

import Link from 'next/link';
import { PanelLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

import { usePathname } from 'next/navigation';
import { DASHBOARD_NAV_ITEMS } from '@/lib/navigation';

const SheetNav = () => {
	return (
		<Sheet>
			<SheetTrigger asChild>
				<Button size='icon' variant='outline' className='sm:hidden'>
					<PanelLeft className='h-5 w-5' />
					<span className='sr-only'>Toggle Menu</span>
				</Button>
			</SheetTrigger>
			<SheetContent side='left' className='sm:max-w-xs'>
				<nav className='grid gap-6 text-lg font-medium'>
					{DASHBOARD_NAV_ITEMS.map((item) => (
						<Link
							key={`sheet-nav-item-${item.href}`}
							href={item.href}
							target={item.target}
							className='flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground'
						>
							<item.Icon size={20} />
							{item.label}
						</Link>
					))}
				</nav>
			</SheetContent>
		</Sheet>
	);
};

export default SheetNav;
