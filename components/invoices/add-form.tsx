'use client';

import React from 'react';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { SubmitButton } from '@/components/ui/submit-button';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft } from 'lucide-react';
import { Form } from '@/components/ui/form';

import SelectPatient from './select-patient';
import InvoiceDetails from './details';
import InvoiceNotes from './notes';
import InvoiceDueDate from './due-date';

import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { insertInvoice, InsertInvoice } from '@/db/schemas/invoices';
import { v4 as uuid } from 'uuid';
import { addInvoice } from '@/lib/invoices/actions';

const InvoicesAddForm = () => {
	const router = useRouter();

	const form = useForm<InsertInvoice>({
		resolver: zodResolver(insertInvoice),
		defaultValues: async () => {
			const id = uuid();
			return {
				id,
				amount: 0,
				paidAmount: 0,
				dueDate: new Date(),
				patientId: null,
			};
		},
	});
	const {
		formState: { isSubmitting },
	} = form;

	const onSubmit = async (values: InsertInvoice) => {
		try {
			const { message, id } = await addInvoice(values);
			if (message === 'Invoice added successfully') {
				toast.success(message);
				router.push(`/dashboard/invoices/edit/${id}`);
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
						<Link href={'/dashboard/invoices'}>
							<ChevronLeft className='h-4 w-4' />
							<span className='sr-only'>Back</span>
						</Link>
					</Button>
					<h1 className='flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0'>
						New Invoice
					</h1>
					<Badge variant='outline' className='ml-auto sm:ml-0'>
						To be paid
					</Badge>
					<div className='hidden items-center gap-2 md:ml-auto md:flex'>
						<Button variant='outline' size='sm' asChild>
							<Link href='/dashboard/invoices'>Discard</Link>
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
						<InvoiceDetails />
					</div>
					<div className='grid auto-rows-max items-start gap-4 lg:gap-8'>
						<InvoiceDueDate />
						<InvoiceNotes />
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

export default InvoicesAddForm;
