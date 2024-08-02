'use client';

import React, { useEffect, useMemo } from 'react';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { SubmitButton } from '@/components/ui/submit-button';
import { ChevronLeft } from 'lucide-react';
import { Form } from '@/components/ui/form';

import SelectPatient from './select-patient';
import SelectInvoice from './select-invoice';
import PaymentDetails from './details';
import PaymentNotes from './notes';
import PaymentDueDate from './date';
import DeletePayment from './delete';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { insertPayment, InsertPayment, Payment } from '@/db/schemas/payments';
import { Patient } from '@/db/schemas/patients';
import { Invoice } from '@/db/schemas/invoices';
import { editPayment } from '@/lib/payments/actions';

interface Props
	extends React.HTMLAttributes<React.ComponentPropsWithoutRef<'div'>> {
	payment: (Payment & { invoice: Invoice; patient: Patient }) | null;
}

const PaymentEditForm: React.FC<Props> = ({ payment }) => {
	const form = useForm<InsertPayment>({
		resolver: zodResolver(insertPayment),
		defaultValues: useMemo(() => {
			if (!payment) return {};
			return {
				id: payment?.id || '',
				amount: payment?.amount || 0,
				date: payment?.date ? new Date(payment?.date) : new Date(),
				patientId: payment?.patient.id || undefined,
				notes: payment?.notes || undefined,
			};
		}, [payment]),
	});
	const {
		formState: { isSubmitting },
	} = form;

	useEffect(() => {
		if (payment) {
			form.reset({
				id: payment?.id || '',
				amount: payment?.amount || 0,
				date: payment?.date ? new Date(payment?.date) : new Date(),
				patientId: payment?.patient.id || undefined,
				notes: payment?.notes || undefined,
			});
		}
	}, [payment]);

	const onSubmit = async (values: InsertPayment) => {
		try {
			console.log(values);
			// const { message } = await editPayment(values);
			// if (message === 'Payment edited successfully') {
			// 	toast.success(message);
			// } else {
			// 	toast.error(message);
			// }
		} catch (error) {
			toast.error('Error editing payment. Please try again.');
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
						Edit Payment
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
						<SelectPatient payment={payment} />
						<SelectInvoice payment={payment} />
						<PaymentDetails />
					</div>
					<div className='grid auto-rows-max items-start gap-4 lg:gap-8'>
						<PaymentDueDate />
						<PaymentNotes />
						<DeletePayment payment={payment} />
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

export default PaymentEditForm;
