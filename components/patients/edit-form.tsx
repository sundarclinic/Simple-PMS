'use client';

import React from 'react';

import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';

import PatientInvoices from './invoices';
import PatientPayments from './payments';
import PatientDateOfBirth from './dob';
import PatientImage from './image';
import DeletePatient from './delete';

import z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Patient, insertPatient, InsertPatient } from '@/db/schemas/patients';
import PatientDetails from './details';

interface Props
	extends React.HTMLAttributes<React.ComponentPropsWithoutRef<'div'>> {
	patient: Patient | null;
}

const PatientEditForm: React.FC<Props> = ({ patient }) => {
	const form = useForm<InsertPatient>({
		resolver: zodResolver(insertPatient),
		defaultValues: {
			name: patient?.name || '',
			email: patient?.email || '',
			phone: patient?.phone || '',
			address: patient?.address || '',
			dob: patient?.dob || '',
			image: patient?.image || '',
			age: patient?.age || 0,
		},
	});

	function onSubmit(values: InsertPatient) {
		console.log(values);
	}

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className='mx-auto grid max-w-[59rem] flex-1 auto-rows-max gap-4'
			>
				<div className='flex items-center gap-4'>
					<Button
						variant='outline'
						size='icon'
						className='h-7 w-7'
						asChild
					>
						<Link href={'/dashboard/patients'}>
							<ChevronLeft className='h-4 w-4' />
							<span className='sr-only'>Back</span>
						</Link>
					</Button>
					<h1 className='flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0'>
						{patient?.name || 'New Patient'}
					</h1>
					<Badge variant='outline' className='ml-auto sm:ml-0'>
						No Dues
					</Badge>
					<div className='hidden items-center gap-2 md:ml-auto md:flex'>
						<Button variant='outline' size='sm' asChild>
							<Link href='/dashboard/patients'>Discard</Link>
						</Button>
						<Button size='sm' type='submit'>
							Save Details
						</Button>
					</div>
				</div>
				<div className='grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8'>
					<div className='grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8'>
						<PatientDetails />
						<PatientInvoices />
						<PatientPayments />
					</div>
					<div className='grid auto-rows-max items-start gap-4 lg:gap-8'>
						<PatientDateOfBirth />
						<PatientImage />
						<DeletePatient />
					</div>
				</div>
				<div className='flex items-center justify-center gap-2 md:hidden'>
					<Button variant='outline' size='sm'>
						Discard
					</Button>
					<Button size='sm' type='submit'>
						Save Details
					</Button>
				</div>
			</form>
		</Form>
	);
};

export default PatientEditForm;
