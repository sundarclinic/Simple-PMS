import Image from 'next/image';
import { File, ListFilter, MoreHorizontal, PlusCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
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
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { getInvoices } from '@/lib/invoices/actions';
import Link from 'next/link';
import InvoicesTable from '@/components/invoices/invoices-table';

export default async function Invoices() {
	const supabase = createClient();

	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		return redirect('/login');
	}

	const invoices = await getInvoices();

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
						<Link href={'invoices/edit'}>
							<PlusCircle className='h-3.5 w-3.5' />
							<span className='sr-only sm:not-sr-only sm:whitespace-nowrap'>
								New Invoice
							</span>
						</Link>
					</Button>
				</div>
			</div>
			<Card>
				<CardHeader>
					<CardTitle>Invoices</CardTitle>
					<CardDescription>
						View and manage your invoices here.
					</CardDescription>
				</CardHeader>
				<CardContent>
					<InvoicesTable invoices={invoices} />
				</CardContent>
			</Card>
		</div>
	);
}
