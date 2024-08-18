'use client';

import React from 'react';
import Image from 'next/image';
import { WobbleCard } from '../ui/wobble-card';

export function TemporaryPages() {
	return (
		<section className='max-w-6xl mx-auto p-4'>
			<h2 className='text-xl md:text-2xl lg:text-3xl leading-relaxed lg:leading-snug font-semibold text-neutral-700'>
				Temporary Public Pages
			</h2>
			<div className='grid grid-cols-1 lg:grid-cols-3 gap-4 w-full mt-4'>
				<WobbleCard
					containerClassName='col-span-1 lg:col-span-2 h-full bg-pink-800 min-h-[500px] lg:min-h-[300px]'
					className=''
				>
					<div className='max-w-xs'>
						<h3 className='text-left text-balance text-base md:text-xl lg:text-3xl font-semibold tracking-[-0.015em] text-white'>
							Secure Information Sharing
						</h3>
						<p className='mt-4 text-left  text-base/6 text-neutral-200'>
							Generate time-limited pages for patients to access
							their invoices, payment details, or medical
							information securely.
						</p>
					</div>
					<Image
						src='/linear.webp'
						width={500}
						height={500}
						alt='linear demo image'
						className='absolute -right-4 lg:-right-[40%] grayscale filter -bottom-10 object-contain rounded-2xl'
					/>
				</WobbleCard>
				<WobbleCard containerClassName='col-span-1 min-h-[300px]'>
					<h3 className='max-w-80  text-left text-balance text-base md:text-xl lg:text-3xl font-semibold tracking-[-0.015em] text-white'>
						Limited Access Duration
					</h3>
					<p className='mt-4 max-w-[26rem] text-left  text-base/6 text-neutral-200'>
						Set page expiration dates up to one week, balancing
						convenience for patients with data security protocols.
					</p>
				</WobbleCard>
				<WobbleCard containerClassName='col-span-1 lg:col-span-3 bg-blue-900 min-h-[500px] lg:min-h-[600px] xl:min-h-[300px]'>
					<div className='max-w-sm'>
						<h3 className='max-w-sm md:max-w-lg  text-left text-balance text-base md:text-xl lg:text-3xl font-semibold tracking-[-0.015em] text-white'>
							Enhanced Patient Communication
						</h3>
						<p className='mt-4 max-w-[26rem] text-left  text-base/6 text-neutral-200'>
							Improve transparency and reduce inquiries by
							providing patients with easy, temporary access to
							their relevant clinic information.
						</p>
					</div>
					<Image
						src='/linear.webp'
						width={500}
						height={500}
						alt='linear demo image'
						className='absolute -right-10 md:-right-[40%] lg:-right-[20%] -bottom-10 object-contain rounded-2xl'
					/>
				</WobbleCard>
			</div>
		</section>
	);
}
