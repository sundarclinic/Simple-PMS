import React from 'react';

import Link from 'next/link';
import { PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

interface Props
	extends React.HTMLAttributes<React.ComponentPropsWithoutRef<typeof Card>> {}

const PatientPayments: React.FC<Props> = () => {
	return (
		<Card>
			<CardHeader>
				<CardTitle>Payments</CardTitle>
				<CardDescription>
					View and manage payments for this patient.
				</CardDescription>
			</CardHeader>
			<CardContent>
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead className='w-[100px]'>SKU</TableHead>
							<TableHead>Stock</TableHead>
							<TableHead>Price</TableHead>
							<TableHead className='w-[100px]'>Size</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						<TableRow>
							<TableCell className='font-semibold'>
								GGPC-001
							</TableCell>
							<TableCell>
								<Label htmlFor='stock-1' className='sr-only'>
									Stock
								</Label>
								<Input
									id='stock-1'
									type='number'
									defaultValue='100'
								/>
							</TableCell>
							<TableCell>
								<Label htmlFor='price-1' className='sr-only'>
									Price
								</Label>
								<Input
									id='price-1'
									type='number'
									defaultValue='99.99'
								/>
							</TableCell>
							<TableCell>
								<ToggleGroup
									type='single'
									defaultValue='s'
									variant='outline'
								>
									<ToggleGroupItem value='s'>
										S
									</ToggleGroupItem>
									<ToggleGroupItem value='m'>
										M
									</ToggleGroupItem>
									<ToggleGroupItem value='l'>
										L
									</ToggleGroupItem>
								</ToggleGroup>
							</TableCell>
						</TableRow>
						<TableRow>
							<TableCell className='font-semibold'>
								GGPC-002
							</TableCell>
							<TableCell>
								<Label htmlFor='stock-2' className='sr-only'>
									Stock
								</Label>
								<Input
									id='stock-2'
									type='number'
									defaultValue='143'
								/>
							</TableCell>
							<TableCell>
								<Label htmlFor='price-2' className='sr-only'>
									Price
								</Label>
								<Input
									id='price-2'
									type='number'
									defaultValue='99.99'
								/>
							</TableCell>
							<TableCell>
								<ToggleGroup
									type='single'
									defaultValue='m'
									variant='outline'
								>
									<ToggleGroupItem value='s'>
										S
									</ToggleGroupItem>
									<ToggleGroupItem value='m'>
										M
									</ToggleGroupItem>
									<ToggleGroupItem value='l'>
										L
									</ToggleGroupItem>
								</ToggleGroup>
							</TableCell>
						</TableRow>
						<TableRow>
							<TableCell className='font-semibold'>
								GGPC-003
							</TableCell>
							<TableCell>
								<Label htmlFor='stock-3' className='sr-only'>
									Stock
								</Label>
								<Input
									id='stock-3'
									type='number'
									defaultValue='32'
								/>
							</TableCell>
							<TableCell>
								<Label htmlFor='price-3' className='sr-only'>
									Stock
								</Label>
								<Input
									id='price-3'
									type='number'
									defaultValue='99.99'
								/>
							</TableCell>
							<TableCell>
								<ToggleGroup
									type='single'
									defaultValue='s'
									variant='outline'
								>
									<ToggleGroupItem value='s'>
										S
									</ToggleGroupItem>
									<ToggleGroupItem value='m'>
										M
									</ToggleGroupItem>
									<ToggleGroupItem value='l'>
										L
									</ToggleGroupItem>
								</ToggleGroup>
							</TableCell>
						</TableRow>
					</TableBody>
				</Table>
			</CardContent>
			<CardFooter className='justify-center border-t p-4'>
				<Button size='sm' variant='ghost' className='gap-1' asChild>
					<Link href='/dashboard/payments/edit'>
						<PlusCircle className='h-3.5 w-3.5' />
						Add Payment
					</Link>
				</Button>
			</CardFooter>
		</Card>
	);
};

export default PatientPayments;
