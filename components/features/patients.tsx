'use client';

import React from 'react';
import Image from 'next/image';
import { WobbleCard } from '../ui/wobble-card';

export function Patients() {
	return (
		<section className='max-w-6xl mx-auto p-4'>
			<h2 className='text-xl md:text-2xl lg:text-3xl leading-relaxed lg:leading-snug font-semibold text-neutral-700'>
				Patient Management
			</h2>
			<div className='grid grid-cols-1 lg:grid-cols-3 gap-4 w-full mt-4'>
				<WobbleCard containerClassName='col-span-1 lg:col-span-3 bg-blue-900 min-h-[500px] lg:min-h-[600px] xl:min-h-[300px]'>
					<div className='max-w-sm'>
						<h3 className='max-w-sm md:max-w-lg  text-left text-balance text-base md:text-xl lg:text-3xl font-semibold tracking-[-0.015em] text-white'>
							Comprehensive Patient Profiles
						</h3>
						<p className='mt-4 max-w-[26rem] text-left  text-base/6 text-neutral-200'>
							Access detailed patient histories, invoices and
							payments all in one place. Keep track of patient
							data and billing information with ease.
						</p>
					</div>
					<Image
						src='/features/patient-1.png'
						width={500}
						height={500}
						alt='linear demo image'
						className='absolute -right-10 md:-right-[40%] lg:-right-[20%] -bottom-10 object-contain rounded-2xl'
					/>
				</WobbleCard>
				<WobbleCard
					containerClassName='col-span-1 lg:col-span-2 h-full bg-pink-800 min-h-[500px] lg:min-h-[300px]'
					className=''
				>
					<div className='max-w-xs'>
						<h3 className='text-left text-balance text-base md:text-xl lg:text-3xl font-semibold tracking-[-0.015em] text-white'>
							Efficient Patient Data Management
						</h3>
						<p className='mt-4 text-left  text-base/6 text-neutral-200'>
							Update, modify, and organize patient information
							effortlessly, ensuring your records are always
							accurate and up-to-date.
						</p>
					</div>
					<Image
						src='/features/patient-2.png'
						width={500}
						height={500}
						alt='linear demo image'
						className='absolute -right-4 lg:-right-[40%] grayscale filter -bottom-10 object-contain rounded-2xl'
					/>
				</WobbleCard>
				<WobbleCard containerClassName='col-span-1 min-h-[300px]'>
					<h3 className='max-w-80  text-left text-balance text-base md:text-xl lg:text-3xl font-semibold tracking-[-0.015em] text-white'>
						Effortless Patient Registration
					</h3>
					<p className='mt-4 max-w-[26rem] text-left  text-base/6 text-neutral-200'>
						Streamline the patient onboarding process with our
						intuitive patient creation tool, capturing all essential
						information seamlessly.
					</p>
				</WobbleCard>
			</div>
		</section>
	);
}
