'use client';

import React, { useEffect, useMemo } from 'react';

import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { SubmitButton } from '@/components/ui/submit-button';

import PatientDateOfBirth from './dob';
import PatientImage from './image';
import DeletePatient from './delete';
import PatientDetails from './details';

import { editPatient } from '@/lib/patients/actions';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Patient, insertPatient, InsertPatient } from '@/db/schemas/patients';

interface Props
	extends React.HTMLAttributes<React.ComponentPropsWithoutRef<'div'>> {
	patient: Patient | null;
}

const PatientEditForm: React.FC<Props> = ({ patient }) => {
	const form = useForm<InsertPatient>({
		resolver: zodResolver(insertPatient),
		defaultValues: useMemo(() => {
			if (!patient) return {};
			return {
				id: patient?.id || '',
				name: patient?.name || '',
				email: patient?.email || undefined,
				phone: patient?.phone || '',
				address: patient?.address || undefined,
				dob: patient?.dob ? new Date(patient?.dob) : undefined,
				image: patient?.image || undefined,
				age: patient?.age || 0,
			};
		}, [patient]),
	});

	const {
		formState: { isSubmitting },
	} = form;

	useEffect(() => {
		if (patient) {
			form.reset({
				id: patient?.id || '',
				name: patient?.name || '',
				email: patient?.email || undefined,
				phone: patient?.phone || '',
				address: patient?.address || undefined,
				dob: patient?.dob ? new Date(patient?.dob) : undefined,
				image: patient?.image || undefined,
				age: patient?.age || 0,
			});
		}
	}, [patient]);

	useEffect(() => {
		const dob = form.watch('dob');
		if (dob) {
			const age = new Date().getFullYear() - dob.getFullYear();
			form.setValue('age', age);
		}
	}, [form.watch('dob')]);

	const onSubmit = async (values: InsertPatient) => {
		try {
			const data = values;
			if (!data.image) {
				data.image = `https://api.dicebear.com/9.x/fun-emoji/svg?seed=${encodeURI(
					data.name
				)}`;
			}
			const { message } = await editPatient(data);
			if (message === 'Patient edited successfully') {
				toast.success(message);
			} else {
				toast.error(message);
			}
		} catch (error) {
			toast.error('Error editing patient. Please try again.');
		}
	};

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className='mx-auto grid max-w-[59rem] flex-1 auto-rows-max gap-4 w-full'
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
						<SubmitButton
							size='sm'
							pendingText='Saving...'
							disabled={isSubmitting}
						>
							Save Details
						</SubmitButton>
					</div>
				</div>
				<div className='grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8'>
					<div className='grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8'>
						<PatientDetails />
					</div>
					<div className='grid auto-rows-max items-start gap-4 lg:gap-8'>
						<PatientDateOfBirth />
						<PatientImage />
						<DeletePatient patient={patient} />
					</div>
				</div>
				<div className='flex items-center justify-center gap-2 md:hidden'>
					<Button variant='outline' size='sm'>
						Discard
					</Button>
					<SubmitButton
						size='sm'
						pendingText='Saving...'
						disabled={isSubmitting}
					>
						Save Details
					</SubmitButton>
				</div>
			</form>
		</Form>
	);
};

export default PatientEditForm;
