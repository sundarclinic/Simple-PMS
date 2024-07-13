import { Source_Sans_3, Poppins } from 'next/font/google';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';

import { cn } from '@/lib/utils';
import { PMS_URL } from '@/lib/config';
import { Metadata } from 'next';

import './globals.css';

export const metadata: Metadata = {
	metadataBase: PMS_URL,
	title: {
		template: '%s | Sundar Clinic PMS',
		default: 'Sundar Clinic PMS',
	},
	description: "Sundar Clinic's very own Patient Management System",
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
				<TooltipProvider>
					{children}
					<Toaster richColors theme='light' />
				</TooltipProvider>
			</body>
		</html>
	);
}
