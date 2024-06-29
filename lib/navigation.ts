import {
	Home,
	LucideIcon,
	Notebook,
	Users,
	BadgeIndianRupee,
	CreditCard,
} from 'lucide-react';
import { HTMLAttributeAnchorTarget } from 'react';

type BaseNavItem = {
	label: string;
	href: string;
	target: HTMLAttributeAnchorTarget;
};

type HomeNavItem = BaseNavItem & {
	Icon: LucideIcon;
};

export const DASHBOARD_NAV_ITEMS: Array<HomeNavItem> = [
	{
		label: 'Dashboard',
		Icon: Home,
		href: '/dashboard',
		target: '_self',
	},
	{
		label: 'Patients',
		Icon: Users,
		href: '/dashboard/patients',
		target: '_self',
	},
	{
		label: 'Invoices',
		Icon: BadgeIndianRupee,
		href: '/dashboard/invoices',
		target: '_self',
	},
	{
		label: 'Payments',
		Icon: CreditCard,
		href: '/dashboard/payments',
		target: '_self',
	},
];
