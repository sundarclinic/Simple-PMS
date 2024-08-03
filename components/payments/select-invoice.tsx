import { useCallback, useEffect, useState } from 'react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from '@/components/ui/command';
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover';
import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer';
import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import BounceLoader from '../ui/bounce-loader';
import { Badge } from '@/components/ui/badge';

import { useSearchParams } from 'next/navigation';
import { useFormContext } from 'react-hook-form';
import { InsertPayment, Payment } from '@/db/schemas/payments';
import { useMediaQuery } from '@/hooks/use-media-query';
import { useDebounce } from '@/hooks/use-debounce';
import { Patient } from '@/db/schemas/patients';
import { capitalize, cn } from '@/lib/utils';
import { toast } from 'sonner';
import { usePathname } from 'next/navigation';
import { Invoice } from '@/db/schemas/invoices';
import {
	getInvoiceById,
	getInvoicesByTitleForPatient,
} from '@/lib/invoices/actions';
import { ReceiptText } from 'lucide-react';
import { getInvoiceStatus } from '@/lib/invoices/utils';

interface Props
	extends React.HTMLAttributes<React.ComponentPropsWithoutRef<typeof Card>> {
	payment?: (Payment & { invoice: Invoice; patient: Patient }) | null;
}

const SelectInvoice: React.FC<Props> = ({ payment }) => {
	const [open, setOpen] = useState(false);
	const isDesktop = useMediaQuery('(min-width: 768px)');
	const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(
		null
	);
	const {
		control,
		formState: { isSubmitting },
		setValue,
		watch,
	} = useFormContext<InsertPayment>();
	const searchParams = useSearchParams();
	const pathname = usePathname();

	const patientId = watch('patientId');

	useEffect(() => {
		if (payment && payment.invoice) {
			setSelectedInvoice(payment.invoice);
		}
	}, [payment]);

	useEffect(() => {
		const invoiceId = searchParams.get('invoiceId');
		if (!invoiceId) return;
		toast.promise(handleGetInvoiceById(invoiceId), {
			loading: 'Adding invoice to payment...',
			success: (invoice: Invoice) => {
				return `Invoice - "${invoice.title}" has been added to payment`;
			},
			error: 'Error adding invoice to payment. Please try adding manually.',
		});
	}, [searchParams]);

	const handleGetInvoiceById = (
		invoiceId: string
	): Promise<Invoice | null> => {
		return new Promise(async (resolve, reject) => {
			const invoice = await getInvoiceById(invoiceId);
			if (invoice) {
				setSelectedInvoice(invoice.invoice);
				setValue('invoiceId', invoice.invoice.id);
				resolve(invoice.invoice);
			} else {
				window.history.replaceState(null, '', pathname);
				reject(null);
			}
		});
	};

	const handleClearnInvoice = () => {
		setSelectedInvoice(null);
		setValue('invoiceId', null);
		window.history.replaceState(null, '', pathname);
	};

	return (
		<Card>
			<CardHeader>
				<CardTitle>Payment For</CardTitle>
			</CardHeader>
			<CardContent>
				<div className='grid gap-6'>
					<FormField
						control={control}
						name='invoiceId'
						disabled={!patientId || isSubmitting}
						render={({ field }) => (
							<FormItem className='grid gap-3'>
								<FormLabel>
									<div>
										<span>Invoice (Optional)</span>
										{field.value !== null ? (
											<Button
												disabled={
													!patientId || isSubmitting
												}
												type='button'
												variant='link'
												className='text-xs m-0 px-1.5 py-0 h-fit'
												onClick={handleClearnInvoice}
											>
												Clear
											</Button>
										) : null}
									</div>
									<p className='text-xs text-muted-foreground mt-2'>
										(Patient must be selected first, and
										then an invoice can be selected. Only
										unpaid or partially paid invoices are
										shown.)
									</p>
								</FormLabel>
								<FormControl>
									{isDesktop ? (
										<Popover
											open={open}
											onOpenChange={setOpen}
										>
											<PopoverTrigger asChild>
												<Button
													disabled={
														!patientId ||
														isSubmitting
													}
													type='button'
													variant='outline'
													className={cn(
														'w-full justify-start',
														{
															'flex items-center gap-4 text-left h-fit':
																selectedInvoice !==
																null,
														}
													)}
												>
													<TriggerButtonContent
														invoice={
															selectedInvoice
														}
													/>
												</Button>
											</PopoverTrigger>
											<PopoverContent
												className='w-full p-0'
												align='start'
											>
												<StatusList
													setOpen={setOpen}
													setSelectedInvoice={
														setSelectedInvoice
													}
													setSelectedInvoiceId={
														field.onChange
													}
													patientId={patientId}
												/>
											</PopoverContent>
										</Popover>
									) : (
										<Drawer
											open={open}
											onOpenChange={setOpen}
										>
											<DrawerTrigger asChild>
												<Button
													disabled={
														!patientId ||
														isSubmitting
													}
													type='button'
													variant='outline'
													className={cn(
														'w-full justify-start',
														{
															'flex items-center gap-4 text-left h-fit':
																selectedInvoice !==
																null,
														}
													)}
												>
													<TriggerButtonContent
														invoice={
															selectedInvoice
														}
													/>
												</Button>
											</DrawerTrigger>
											<DrawerContent>
												<div className='mt-4 border-t'>
													<StatusList
														setOpen={setOpen}
														setSelectedInvoice={
															setSelectedInvoice
														}
														setSelectedInvoiceId={
															field.onChange
														}
														patientId={patientId}
													/>
												</div>
											</DrawerContent>
										</Drawer>
									)}
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>
			</CardContent>
		</Card>
	);
};

export default SelectInvoice;

function TriggerButtonContent({ invoice }: { invoice: Invoice | null }) {
	if (invoice) {
		const status = getInvoiceStatus(invoice);

		return (
			<>
				<ReceiptText />
				<div>
					<div className='font-semibold flex items-center gap-2'>
						<span>{invoice.title}</span>
						<Badge
							variant='outline'
							className={cn('text-white text-xs', {
								'bg-red-500': status === 'unpaid',
								'bg-green-500': status === 'paid',
								'bg-orange-500': status === 'partially-paid',
							})}
						>
							{capitalize(status)}
						</Badge>
					</div>
					<div className='flex items-center gap-1 flex-wrap'>
						<span className='text-muted-foreground'>
							{invoice.amount} (Amount)
						</span>
						|
						<span className='text-muted-foreground'>
							{invoice.paidAmount} (Paid Amount)
						</span>
						|
						<span className='text-muted-foreground'>
							{invoice.amount - invoice.paidAmount} (Balance)
						</span>
					</div>
				</div>
			</>
		);
	}

	return <>+ Select Invoice</>;
}

function StatusList({
	setOpen,
	setSelectedInvoice,
	setSelectedInvoiceId,
	patientId,
}: {
	setOpen: (open: boolean) => void;
	setSelectedInvoice: (invoice: Invoice | null) => void;
	setSelectedInvoiceId: (invoiceId: string) => void;
	patientId: Patient['id'];
}) {
	const [invoices, setInvoices] = useState<Invoice[]>([]);
	const [loading, setLoading] = useState(false);

	const userInputCallback = useCallback(async (value: string) => {
		try {
			setLoading(true);
			const results = await getInvoicesByTitleForPatient({
				title: value,
				patientId,
			});
			if (results.length > 0) {
				setInvoices(results);
			} else {
				setInvoices([]);
			}
		} catch {
			setInvoices([]);
		} finally {
			setLoading(false);
		}
	}, []);

	return (
		<Command
			shouldFilter={false}
			className='sm:min-w-[20rem] lg:min-w-[28rem]'
		>
			<CommandInput
				placeholder='Search by invoice title...'
				onValueChange={useDebounce(userInputCallback, 500)}
			/>
			<CommandList className='p-2'>
				<CommandGroup>
					{loading ? (
						<BounceLoader className='my-4' />
					) : invoices.length === 0 ? (
						<CommandEmpty className='max-w-[12rem] lg:max-w-none text-muted-foreground text-sm text-center'>
							No invoices found. Try a different search term.
						</CommandEmpty>
					) : (
						invoices.map((invoice) => {
							const status = getInvoiceStatus(invoice);

							return (
								<CommandItem
									key={invoice.id}
									value={invoice.id}
									onSelect={(value) => {
										setSelectedInvoice(invoice);
										setSelectedInvoiceId(value);
										setOpen(false);
									}}
									className='flex items-center gap-4 cursor-pointer'
								>
									<ReceiptText />
									<div>
										<div className='font-semibold flex items-center gap-2'>
											<span>{invoice.title}</span>
											<Badge
												variant='outline'
												className={cn(
													'text-white text-xs',
													{
														'bg-red-500':
															status === 'unpaid',
														'bg-green-500':
															status === 'paid',
														'bg-orange-500':
															status ===
															'partially-paid',
													}
												)}
											>
												{capitalize(status)}
											</Badge>
										</div>
										<div className='flex items-center flex-wrap gap-1'>
											<span className='text-muted-foreground'>
												{invoice.amount} (Amount)
											</span>
											|
											<span className='text-muted-foreground'>
												{invoice.paidAmount} (Paid
												Amount)
											</span>
											|
											<span className='text-muted-foreground'>
												{invoice.amount -
													invoice.paidAmount}{' '}
												(Balance)
											</span>
										</div>
									</div>
								</CommandItem>
							);
						})
					)}
				</CommandGroup>
			</CommandList>
		</Command>
	);
}
