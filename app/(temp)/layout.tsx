import Footer from '@/components/temp/footer';
import Navbar from '@/components/temp/navbar';

export default function Layout({ children }: { children: React.ReactNode }) {
	return (
		<div className='w-full min-h-screen flex flex-col items-center'>
			<Navbar />
			<main className='w-full flex-1 p-4'>{children}</main>
			<Footer />
		</div>
	);
}
