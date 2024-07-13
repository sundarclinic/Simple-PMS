import Link from 'next/link';
import { File, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import PatientsTable from '@/components/patients/patients-table';

import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { getPatients } from '@/lib/patients/actions';
import { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'Patients',
};

export default async function Patients() {
	const supabase = createClient();

	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		return redirect('/login');
	}

	const patients = await getPatients();

	return (
		<div className='grid items-start gap-4'>
			<div className='flex items-center justify-end'>
				<div className='flex items-center gap-2'>
					<Button
						size='sm'
						variant='outline'
						className='h-7 gap-1'
						disabled
					>
						<File className='h-3.5 w-3.5' />
						<span className='sr-only sm:not-sr-only sm:whitespace-nowrap'>
							Export
						</span>
					</Button>
					<Button size='sm' className='h-7 gap-1' asChild>
						<Link href={'patients/edit'}>
							<PlusCircle className='h-3.5 w-3.5' />
							<span className='sr-only sm:not-sr-only sm:whitespace-nowrap'>
								New Patient
							</span>
						</Link>
					</Button>
				</div>
			</div>
			<Card>
				<CardHeader>
					<CardTitle>Patients</CardTitle>
					<CardDescription>
						View and manage your patients here.
					</CardDescription>
				</CardHeader>
				<CardContent>
					<PatientsTable patients={patients} />
				</CardContent>
			</Card>
		</div>
	);
}
