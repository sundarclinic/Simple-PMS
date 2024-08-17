import React from 'react';

import Link from 'next/link';
import { Button } from '@/components/ui/button';

import { CLINIC_URL } from '@/lib/config';

const NothingFound = () => {
	return (
		<section className='max-w-4xl mx-auto'>
			<h1 className='text-4xl font-bold'>Nothing Found</h1>
			<p className='text-lg'>
				Sorry, we couldn't find anything here. Please try again later.
			</p>
			<Button variant='link' asChild className='px-0'>
				<Link href={CLINIC_URL.toString()}>Visit our website</Link>
			</Button>
		</section>
	);
};

export default NothingFound;
