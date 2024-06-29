import * as React from 'react';

import Sidebar from '@/components/dashboard/sidebar';
import SheetNav from '@/components/dashboard/sheet-nav';
import DashboardBreadcrumb from '@/components/dashboard/breadcrumb';
import PatientSearch from '@/components/dashboard/patient-search';
import ProfileDropdown from '@/components/dashboard/profile-dropdown';

export default function Layout({ children }: { children: React.ReactNode }) {
	return (
		<div className='flex min-h-screen w-full flex-col bg-muted/40'>
			<Sidebar />
			<div className='flex flex-col sm:gap-4 sm:py-4 sm:pl-14'>
				<header className='sticky w-full top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6'>
					<SheetNav />
					<DashboardBreadcrumb />
					<PatientSearch />
					<ProfileDropdown />
				</header>
				<main className='p-4 sm:px-6 sm:py-0 flex-1'>{children}</main>
			</div>
		</div>
	);
}
