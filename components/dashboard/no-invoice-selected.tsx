import React from 'react';

import Image from 'next/image';
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';

const NoInvoiceSelected = () => {
	return (
		<Card className='overflow-hidden'>
			<CardContent>
				<div className='max-w-2xl w-full'>
					<Image
						src='/illustrations/processing.png'
						width={100}
						height={100}
						className='w-full h-auto object-cover'
						unoptimized
						priority
						alt=''
						aria-label='Illustrations from https://dribbble.com/shots/19856175-AI-Illustration-Healthcare'
					/>
				</div>
				<p className='text-center font-semibold'>No Invoice Selected</p>
				<p className='text-muted-foreground text-center text-sm max-w-[14rem] mx-auto'>
					Please select an invoice from the list to view or edit it.
				</p>
			</CardContent>
		</Card>
	);
};

export default NoInvoiceSelected;
