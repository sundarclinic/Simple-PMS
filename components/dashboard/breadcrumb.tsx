'use client';

import React from 'react';

import Link from 'next/link';
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

import { usePathname } from 'next/navigation';
import { capitalize } from '@/lib/utils';

const DashboardBreadcrumb = () => {
	const pathname = usePathname();
	const segments = pathname.split('/').filter((item) => item !== '');

	return (
		<Breadcrumb className='hidden md:flex'>
			<BreadcrumbList>
				{segments.map((segment, index) => (
					<>
						<BreadcrumbItem key={`${segment}-item`}>
							<BreadcrumbLink
								asChild
								className={
									index === segments.length - 1
										? 'pointer-events-none'
										: ''
								}
								aria-disabled={index === segments.length - 1}
								tabIndex={
									index === segments.length - 1
										? -1
										: undefined
								}
							>
								<Link
									href={`/${segments
										.slice(0, index + 1)
										.join('/')}`}
									aria-label={`Go to ${capitalize(segment)}`}
								>
									{capitalize(segment)}
								</Link>
							</BreadcrumbLink>
						</BreadcrumbItem>
						{index !== segments.length - 1 ? (
							<BreadcrumbSeparator key={`${segment}-separator`} />
						) : null}
					</>
				))}
			</BreadcrumbList>
		</Breadcrumb>
	);
};

export default DashboardBreadcrumb;
