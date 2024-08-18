import { Hero } from '@/components/features/hero';
import { Dashboard } from '@/components/features/dashboard';
import { Patients } from '@/components/features/patients';
import { Invoices } from '@/components/features/invoices';
import { Payments } from '@/components/features/payments';
import { TemporaryPages } from '@/components/features/temporary-pages';

export default function Features() {
	return (
		<div className='flex flex-col gap-4'>
			<Hero />
			<Dashboard />
			<Patients />
			<Invoices />
			<Payments />
			<TemporaryPages />
		</div>
	);
}
