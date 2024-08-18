'use client';

import React from 'react';
import Image from 'next/image';
import { WobbleCard } from '../ui/wobble-card';

export function Payments() {
	return (
		<section className='max-w-6xl mx-auto p-4'>
			<h2 className='text-xl md:text-2xl lg:text-3xl leading-relaxed lg:leading-snug font-semibold text-neutral-700'>
				Payment Management
			</h2>
			<div className='grid grid-cols-1 lg:grid-cols-3 gap-4 w-full mt-4'>
				<WobbleCard
					containerClassName='col-span-1 lg:col-span-2 h-full bg-pink-800 min-h-[500px] lg:min-h-[300px]'
					className=''
				>
					<div className='max-w-xs'>
						<h3 className='text-left text-balance text-base md:text-xl lg:text-3xl font-semibold tracking-[-0.015em] text-white'>
							Versatile Payment Creation
						</h3>
						<p className='mt-4 text-left  text-base/6 text-neutral-200'>
							Record various payment types, including cash, credit
							cards, and insurance, ensuring comprehensive
							financial tracking.
						</p>
					</div>
					<Image
						src='/features/payment.png'
						width={500}
						height={500}
						alt='linear demo image'
						className='absolute -right-4 lg:-right-[40%] grayscale filter -bottom-10 object-contain rounded-2xl'
					/>
				</WobbleCard>
				<WobbleCard containerClassName='col-span-1 min-h-[300px]'>
					<h3 className='max-w-80  text-left text-balance text-base md:text-xl lg:text-3xl font-semibold tracking-[-0.015em] text-white'>
						Efficient Payment Processing
					</h3>
					<p className='mt-4 max-w-[26rem] text-left  text-base/6 text-neutral-200'>
						Edit & void payments, and track payment status with ease
						to ensure accurate financial records.
					</p>
				</WobbleCard>
			</div>
		</section>
	);
}
