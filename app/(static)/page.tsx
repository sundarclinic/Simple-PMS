import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

import { createClient } from '@/utils/supabase/server';

export default async function Index() {
	const supabase = createClient();

	const {
		data: { user },
	} = await supabase.auth.getUser();

	return (
		<section className='flex items-center justify-center flex-col max-w-7xl mx-auto p-4 pt-8 min-h-screen'>
			<h1 className='text-4xl'>
				Sundar Clinic,{' '}
				<abbr
					title='Patient Management System'
					className='text-sm text-red-500'
				>
					PMS
				</abbr>
			</h1>
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
			<Button asChild>
				<Link href={user ? '/dashboard' : '/login'}>
					{user ? 'Dashboard' : 'Login'}
				</Link>
			</Button>
		</section>
	);
}
