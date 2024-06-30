'use client';

import React, { useEffect, useRef } from 'react';

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
import PatientDetails from './details';

import { useRouter } from 'next/navigation';
import { useFormState } from 'react-dom';
import { addPatient, editPatient } from '@/lib/patients/actions';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Patient, insertPatient, InsertPatient } from '@/db/schemas/patients';

const PatientAddForm: React.FC<Props> = () => {
	const router = useRouter();
	const formRef = useRef<HTMLFormElement>(null);
	const actionFuction = patient ? editPatient(patient.id) : addPatient;
	const [state, formAction] = useFormState(actionFuction, {
		message: '',
	});
	const form = useForm<InsertPatient>({
		resolver: zodResolver(insertPatient),
		defaultValues: {
			name: patient?.name || '',
			email: patient?.email || undefined,
			phone: patient?.phone || '',
			address: patient?.address || undefined,
			dob: patient?.dob ? new Date(patient?.dob) : undefined,
			image: patient?.image || undefined,
			age: patient?.age || 0,
			...(state?.fields ?? {}),
		},
	});

	useEffect(() => {
		if (patient) {
			const parsed = insertPatient.safeParse(patient);
			if (parsed.success) form.reset(parsed.data);
		}
	}, []);

	useEffect(() => {
		const dob = form.watch('dob');
		if (dob) {
			const age = new Date().getFullYear() - dob.getFullYear();
			form.setValue('age', age);
		}
	}, [form.watch('dob')]);

	useEffect(() => {
		if (state?.message.length > 0 && state?.issues?.length === 0) {
			toast.success(state.message);
			if (!patient) {
				router.push(`/dashboard/patients/edit/id=${state?.id}`);
			}
		} else if (
			state?.message.length > 0 &&
			state?.issues &&
			state?.issues?.length > 0
		) {
			toast.error(state.message, {
				description: state.issues?.join(', '),
			});
		}
	}, [state]);

	const onSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
		await form.trigger();
		if (form.formState.isValid) {
			formRef.current?.requestSubmit();
		} else {
			e.preventDefault();
		}
	};

	return (
		<Form {...form}>
			<form
				onSubmit={onSubmit}
				action={formAction}
				ref={formRef}
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
						<PatientInvoices patient={patient} />
						<PatientPayments patient={patient} />
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
					<Button size='sm' type='submit'>
						Save Details
					</Button>
				</div>
			</form>
		</Form>
	);
};

export default PatientAddForm;
