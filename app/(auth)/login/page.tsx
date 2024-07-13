import Image from 'next/image';
import Link from 'next/link';

import LoginForm from '@/components/auth/login-form';

import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'Login',
};

export default async function Login() {
	const supabase = createClient();

	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (user) {
		return redirect('/dashboard');
	}

	return (
		<div className='w-full lg:grid lg:grid-cols-2 min-h-screen p-4 lg:p-0 flex justify-center'>
			<div className='flex items-center justify-center py-12 w-full'>
				<div className='mx-auto grid max-w-md w-full gap-6'>
					<div className='grid gap-2 text-center'>
						<h1 className='text-3xl font-bold'>Login</h1>
						<p className='text-balance text-muted-foreground'>
							Enter your email below to login to your account
						</p>
					</div>
					<LoginForm />
				</div>
			</div>
			<div className='hidden bg-muted lg:block'>
				<figure className='w-full h-full max-h-screen overflow-hidden img-caption'>
					<Image
						src='/illustrations/clinic.png'
						alt='Image'
						width='100'
						height='100'
						className='h-full w-full object-cover dark:brightness-[0.2] dark:grayscale aspect-auto'
						unoptimized
					/>
					<figcaption>
						Image credit:{' '}
						<Link
							href={
								'https://dribbble.com/shots/20560963-Hospital-Illustration'
							}
							target='_blank'
							rel='noopener noreferrer'
						>
							Qoyyum Arfi
						</Link>
					</figcaption>
				</figure>
			</div>
		</div>
	);
}
