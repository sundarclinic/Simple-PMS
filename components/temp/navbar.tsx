import React from 'react';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

import { CLINIC_LOCATION_URL, CLINIC_URL } from '@/lib/config';

const Navbar = () => {
	return (
		<nav className='p-4 w-full border-b sticky top-0 bg-white'>
			<div className='max-w-6xl mx-auto flex items-center justify-between gap-4 flex-wrap'>
				<Link
					href={CLINIC_URL.toString()}
					target='_blank'
					className='max-w-[6rem]'
				>
					<Image
						src='/logo/logo-fit.png'
						alt='Sundar Clinic Logo'
						width={50}
						height={50}
						className='w-fit h-auto object-cover'
						unoptimized
					/>
				</Link>
				<div className='hidden sm:flex items-center gap-2'>
					<Button asChild variant='outline'>
						<Link href={CLINIC_URL.toString()} target='_blank'>
							View Website
						</Link>
					</Button>
					<Button asChild>
						<Link
							href={CLINIC_LOCATION_URL.toString()}
							target='_blank'
						>
							Visit Now
						</Link>
					</Button>
				</div>
			</div>
		</nav>
	);
};

export default Navbar;
