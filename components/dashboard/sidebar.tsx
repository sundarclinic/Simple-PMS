'use client';

import React from 'react';

import Link from 'next/link';
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from '@/components/ui/tooltip';

import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { DASHBOARD_NAV_ITEMS } from '@/lib/navigation';

const Sidebar = () => {
	const pathname = usePathname();
	return (
		<aside className='fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex'>
			<nav className='flex flex-col items-center gap-4 px-2 sm:py-4'>
				{DASHBOARD_NAV_ITEMS.map((item) => (
					<Tooltip key={`sidebar-item-${item.href}`}>
						<TooltipTrigger asChild>
							<Link
								href={item.href}
								target={item.target}
								className={cn(
									'flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors md:h-8 md:w-8 group md:text-base',
									{
										'rounded-full bg-primary font-semibold text-primary-foreground':
											pathname === item.href,
										'hover:text-foreground':
											pathname !== item.href,
									}
								)}
							>
								<item.Icon
									className={cn('shrink-0', {
										'transition-all group-hover:scale-110':
											pathname !== item.href,
									})}
									size={20}
								/>
								<span className='sr-only'>{item.label}</span>
							</Link>
						</TooltipTrigger>
						<TooltipContent side='right'>
							{item.label}
						</TooltipContent>
					</Tooltip>
				))}
			</nav>
			{/* <nav className='mt-auto flex flex-col items-center gap-4 px-2 sm:py-4'>
				<Tooltip>
					<TooltipTrigger asChild>
						<Link
							href='#'
							className='flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8'
						>
							<Settings className='h-5 w-5' />
							<span className='sr-only'>Settings</span>
						</Link>
					</TooltipTrigger>
					<TooltipContent side='right'>Settings</TooltipContent>
				</Tooltip>
			</nav> */}
		</aside>
	);
};

export default Sidebar;
