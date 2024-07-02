import React from 'react';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { BadgeIndianRupee, CreditCard, Users } from 'lucide-react';
import LogoutButton from '../auth/logout-button';

const ProfileDropdown = () => (
	<DropdownMenu>
		<DropdownMenuTrigger asChild>
			<Button
				variant='outline'
				size='icon'
				className='overflow-hidden rounded-full'
			>
				<Image
					src='/logo/logo-square.png'
					width={36}
					height={36}
					alt='Avatar'
					className='overflow-hidden rounded-full'
				/>
			</Button>
		</DropdownMenuTrigger>
		<DropdownMenuContent align='end'>
			<DropdownMenuLabel>Sundar Clinic</DropdownMenuLabel>
			<DropdownMenuSeparator />
			<DropdownMenuItem asChild className='w-full cursor-pointer'>
				<Link href={'/dashboard/patients/edit'}>
					<Users className='mr-2' size={16} />
					<span>New Patient</span>
				</Link>
			</DropdownMenuItem>
			<DropdownMenuItem asChild className='w-full cursor-pointer'>
				<Link href={'/dashboard/invoices/edit'}>
					<BadgeIndianRupee className='mr-2' size={16} />
					<span>New Invoice</span>
				</Link>
			</DropdownMenuItem>
			<DropdownMenuItem asChild className='w-full cursor-pointer'>
				<Link href='/dashboard/payments/edit'>
					<CreditCard className='mr-2' size={16} />
					<span>New Payment</span>
				</Link>
			</DropdownMenuItem>
			<DropdownMenuSeparator />
			<DropdownMenuItem asChild className='p-0'>
				<LogoutButton />
			</DropdownMenuItem>
		</DropdownMenuContent>
	</DropdownMenu>
);

export default ProfileDropdown;
