import { Source_Sans_3, Poppins } from 'next/font/google';

import { cn } from '@/lib/utils';
import './globals.css';

const defaultUrl = process.env.VERCEL_URL
	? `https://${process.env.VERCEL_URL}`
	: 'http://localhost:3000';

export const metadata = {
	metadataBase: new URL(defaultUrl),
	title: 'Next.js and Supabase Starter Kit',
	description: 'The fastest way to build apps with Next.js and Supabase',
};

const sourceSans3 = Source_Sans_3({
	display: 'swap',
	subsets: ['latin'],
	variable: '--font-source-sans-3',
	style: ['italic', 'normal'],
	weight: ['200', '300', '400', '500', '600', '700', '800', '900'],
});

const poppins = Poppins({
	display: 'swap',
	subsets: ['latin'],
	variable: '--font-poppins',
	style: ['italic', 'normal'],
	weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
});

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html
			lang='en'
			className={cn(sourceSans3.className, poppins.className)}
		>
			<body className='bg-background text-foreground font-sans'>
				{children}
			</body>
		</html>
	);
}
