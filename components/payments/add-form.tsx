'use client';

import React from 'react';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { SubmitButton } from '@/components/ui/submit-button';
import { ChevronLeft } from 'lucide-react';
import { Form } from '@/components/ui/form';

import SelectPatient from './select-patient';
import SelectInvoice from './select-invoice';
import PaymentDetails from './details';
import PaymentNotes from './notes';
import PaymentDate from './date';

import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { insertPayment, InsertPayment } from '@/db/schemas/payments';
import { v4 as uuid } from 'uuid';
import { addPayment } from '@/lib/payments/actions';

const PaymentAddForm = () => {
	const router = useRouter();

	const form = useForm<InsertPayment>({
		resolver: zodResolver(insertPayment),
		defaultValues: async () => {
			const id = uuid();
			return {
				id,
				amount: 0,
				date: new Date(),
				patientId: null,
				invoiceId: null,
			};
		},
	});
	const {
		formState: { isSubmitting },
	} = form;

	const onSubmit = async (values: InsertPayment) => {
		try {
			const { message } = await addPayment(values);
			if (message === 'Payment added successfully') {
				toast.success(message);
				router.push(`/dashboard/payments`);
			} else {
				toast.error(message);
			}
		} catch (error) {
			toast.error('Error adding invoice. Please try again.');
		}
	};

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className='mx-auto w-full grid max-w-[59rem] flex-1 auto-rows-max gap-4'
			>
				<div className='flex items-center gap-4'>
					<Button
						variant='outline'
						size='icon'
						className='h-7 w-7'
						asChild
					>
						<Link href={'/dashboard/payments'}>
							<ChevronLeft className='h-4 w-4' />
							<span className='sr-only'>Back</span>
						</Link>
					</Button>
					<h1 className='flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0'>
						New Payment
					</h1>
					<div className='hidden items-center gap-2 md:ml-auto md:flex'>
						<Button variant='outline' size='sm' asChild>
							<Link href='/dashboard/payments'>Discard</Link>
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
						<SelectPatient />
						<SelectInvoice />
						<PaymentDetails />
					</div>
					<div className='grid auto-rows-max items-start gap-4 lg:gap-8'>
						<PaymentDate />
						<PaymentNotes />
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

export default PaymentAddForm;
