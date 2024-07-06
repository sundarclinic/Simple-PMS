import { Copy, MoreVertical, ReceiptText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';

import { Invoice } from '@/db/schemas/invoices';
import { Patient } from '@/db/schemas/patients';
import { currencyFormatter, dateFormatter } from '@/lib/utils';

interface Props
	extends React.HTMLAttributes<React.ComponentPropsWithoutRef<typeof Card>> {
	invoice: { invoice: Invoice; patient: Patient };
}

export default function RecentInvoice({ invoice }: Props) {
	return (
		<Card className='overflow-hidden w-full'>
			<CardHeader className='bg-muted/50'>
				<div className='flex flex-row items-start gap-2'>
					<section className='grid gap-0.5'>
						<CardTitle className='group flex flex-col text-lg'>
							<span>Invoice</span>
							<div className='flex gap-2 items-center'>
								<span className='text-xs font-normal'>
									{invoice.invoice.id}
								</span>
								<Button
									size='icon'
									variant='outline'
									className='h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100 shrink-0'
								>
									<Copy className='h-3 w-3' />
									<span className='sr-only'>
										Copy Order ID
									</span>
								</Button>
							</div>
						</CardTitle>
					</section>
					<section className='ml-auto flex items-center gap-1'>
						<Button
							size='sm'
							variant='outline'
							className='h-8 gap-1'
						>
							<ReceiptText className='h-3.5 w-3.5' />
							<span className='lg:sr-only xl:not-sr-only xl:whitespace-nowrap'>
								Mark as Paid
							</span>
						</Button>
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button
									size='icon'
									variant='outline'
									className='h-8 w-8'
								>
									<MoreVertical className='h-3.5 w-3.5' />
									<span className='sr-only'>More</span>
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align='end'>
								<DropdownMenuItem>Edit</DropdownMenuItem>
								<DropdownMenuItem>Export</DropdownMenuItem>
								<DropdownMenuSeparator />
								<DropdownMenuItem>Trash</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</section>
				</div>
				<CardDescription className='mt-2'>
					<span>
						Created At:{' '}
						<time
							dateTime={new Date(
								invoice.invoice.createdAt
							).toDateString()}
						>
							{dateFormatter(new Date(invoice.invoice.createdAt))}
						</time>
						,{' '}
					</span>
					<span>
						Due Date:{' '}
						<time
							dateTime={new Date(
								invoice.invoice.dueDate
							).toDateString()}
						>
							{dateFormatter(new Date(invoice.invoice.dueDate))}
						</time>
					</span>
				</CardDescription>
			</CardHeader>

			<CardContent className='p-6 text-sm'>
				<div className='grid gap-3'>
					<div className='font-semibold'>Invoice Details</div>
					<ul className='grid gap-3'>
						<li className='flex items-center justify-between'>
							<span className='text-muted-foreground'>
								Amount
							</span>
							<span>
								{currencyFormatter(invoice.invoice.amount)}
							</span>
						</li>
						<li className='flex items-center justify-between'>
							<span className='text-muted-foreground'>
								Paid Amount
							</span>
							<span>
								{currencyFormatter(invoice.invoice.paidAmount)}
							</span>
						</li>
					</ul>
					<Separator className='my-2' />
					<ul className='grid gap-3'>
						<li className='flex items-center justify-between font-semibold'>
							<span className='text-muted-foreground'>
								Amount Due
							</span>
							<span>
								{currencyFormatter(
									invoice.invoice.amount -
										invoice.invoice.paidAmount
								)}
							</span>
						</li>
					</ul>
				</div>
				<Separator className='my-4' />
				<div className='grid gap-3'>
					<div className='font-semibold'>Address</div>
					<address className='grid gap-0.5 not-italic text-muted-foreground'>
						{invoice.patient.address ? (
							<span>{invoice.patient.address}</span>
						) : (
							<span>Not provided</span>
						)}
					</address>
				</div>
				<Separator className='my-4' />
				<div className='grid gap-3'>
					<div className='font-semibold'>Patient Information</div>
					<dl className='grid gap-3'>
						<div className='flex items-center justify-between'>
							<dt className='text-muted-foreground'>Patient</dt>
							<dd>{invoice.patient.name}</dd>
						</div>
						<div className='flex items-center justify-between'>
							<dt className='text-muted-foreground'>Email</dt>
							<dd>
								<a href='mailto:'>liam@acme.com</a>
							</dd>
						</div>
						<div className='flex items-center justify-between'>
							<dt className='text-muted-foreground'>Phone</dt>
							<dd>
								<a href='tel:'>{invoice.patient.phone}</a>
							</dd>
						</div>
					</dl>
				</div>
			</CardContent>
			<CardFooter className='flex flex-row items-center border-t bg-muted/50 px-6 py-3'>
				<div className='text-xs text-muted-foreground'>
					Last Updated{' '}
					<time
						dateTime={new Date(
							invoice.invoice.updatedAt
						).toDateString()}
					>
						{dateFormatter(new Date(invoice.invoice.updatedAt))}
					</time>
				</div>
			</CardFooter>
		</Card>
	);
}
