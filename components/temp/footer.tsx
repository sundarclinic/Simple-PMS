import React from 'react';

import Link from 'next/link';

import { CLINIC_URL } from '@/lib/config';

const Footer = () => {
	return (
		<footer className='p-4'>
			<div className='max-w-6xl mx-auto text-center'>
				<q className='font-semibold'>
					Not just a better healthcare, but a better healthcare
					experience.
				</q>
				<p className='text-center'>
					&copy; 2024{' '}
					<Link
						href={CLINIC_URL.toString()}
						target='_blank'
						className='text-primary underline-offset-4 hover:underline'
					>
						Sundar Clinic
					</Link>
					. All rights reserved.
				</p>
			</div>
		</footer>
	);
};

export default Footer;
