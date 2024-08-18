'use client';

import React from 'react';
import Image from 'next/image';
import { WobbleCard } from '../ui/wobble-card';

export function Invoices() {
	return (
		<section className='max-w-6xl mx-auto p-4'>
			<h2 className='text-xl md:text-2xl lg:text-3xl leading-relaxed lg:leading-snug font-semibold text-neutral-700'>
				Invoice Management
			</h2>
			<div className='grid grid-cols-1 lg:grid-cols-3 gap-4 w-full mt-4'>
				<WobbleCard containerClassName='col-span-1 lg:col-span-3 bg-blue-900 min-h-[500px] lg:min-h-[600px] xl:min-h-[300px]'>
					<div className='max-w-sm'>
						<h3 className='max-w-sm md:max-w-lg  text-left text-balance text-base md:text-xl lg:text-3xl font-semibold tracking-[-0.015em] text-white'>
							Clear Invoice Tracking
						</h3>
						<p className='mt-4 max-w-[26rem] text-left  text-base/6 text-neutral-200'>
							Easily view and monitor the status of all invoices,
							from creation to payment, improving your clinic's
							financial oversight.
						</p>
					</div>
					<Image
						src='/features/invoice-1.png'
						width={500}
						height={500}
						alt='linear demo image'
						className='absolute -right-10 md:-right-[40%] lg:-right-[20%] -bottom-10 object-contain rounded-2xl'
					/>
				</WobbleCard>
				<WobbleCard containerClassName='col-span-1 min-h-[300px]'>
					<h3 className='max-w-80  text-left text-balance text-base md:text-xl lg:text-3xl font-semibold tracking-[-0.015em] text-white'>
						Simplified Invoice Generation
					</h3>
					<p className='mt-4 max-w-[26rem] text-left  text-base/6 text-neutral-200'>
						Create professional, detailed invoices in minutes,
						customized to the clinic's branding and specific patient
						treatments.
					</p>
				</WobbleCard>
				<WobbleCard
					containerClassName='col-span-1 lg:col-span-2 h-full bg-pink-800 min-h-[500px] lg:min-h-[300px]'
					className=''
				>
					<div className='max-w-xs'>
						<h3 className='text-left text-balance text-base md:text-xl lg:text-3xl font-semibold tracking-[-0.015em] text-white'>
							Flexible Invoice Management
						</h3>
						<p className='mt-4 text-left  text-base/6 text-neutral-200'>
							Edit, void, or reissue invoices as needed,
							maintaining accurate financial records and adapting
							to changing circumstances.
						</p>
					</div>
					<Image
						src='/features/invoice-2.png'
						width={500}
						height={500}
						alt='linear demo image'
						className='absolute -right-4 lg:-right-[40%] grayscale filter -bottom-10 object-contain rounded-2xl'
					/>
				</WobbleCard>
			</div>
		</section>
	);
}
