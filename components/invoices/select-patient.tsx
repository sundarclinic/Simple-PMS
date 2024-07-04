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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import BounceLoader from '../ui/bounce-loader';

import { useFormContext } from 'react-hook-form';
import { InsertInvoice } from '@/db/schemas/invoices';
import { useMediaQuery } from '@/hooks/use-media-query';
import { useDebounce } from '@/hooks/use-debounce';
import { getPatientsByName } from '@/lib/patients/actions';
import { Patient } from '@/db/schemas/patients';
import { cn } from '@/lib/utils';
import { Invoice } from '@/lib/types';

interface Props
	extends React.HTMLAttributes<React.ComponentPropsWithoutRef<typeof Card>> {
	invoice?: { invoice: Invoice; patient: Patient } | null;
}

const SelectPatient: React.FC<Props> = ({ invoice }) => {
	const [open, setOpen] = useState(false);
	const isDesktop = useMediaQuery('(min-width: 768px)');
	const [selectedPatient, setSelectedPatient] = useState<Patient | null>(
		null
	);
	const {
		control,
		formState: { isSubmitting },
	} = useFormContext<InsertInvoice>();

	useEffect(() => {
		if (invoice) {
			setSelectedPatient(invoice.patient);
		}
	}, [invoice]);

	return (
		<Card>
			<CardHeader>
				<CardTitle>Invoice For</CardTitle>
			</CardHeader>
			<CardContent>
				<div className='grid gap-6'>
					<FormField
						control={control}
						name='patientId'
						disabled={isSubmitting}
						render={({ field }) => (
							<FormItem className='grid gap-3'>
								<FormLabel>Patient</FormLabel>
								<FormControl>
									{isDesktop ? (
										<Popover
											open={open}
											onOpenChange={setOpen}
										>
											<PopoverTrigger asChild>
												<Button
													type='button'
													variant='outline'
													className={cn(
														'w-full justify-start',
														{
															'flex items-center gap-4 text-left h-fit':
																selectedPatient !==
																null,
														}
													)}
												>
													<TriggerButtonContent
														patient={
															selectedPatient
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
													setSelectedPatient={
														setSelectedPatient
													}
													setSelectedPatientId={
														field.onChange
													}
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
													type='button'
													variant='outline'
													className={cn(
														'w-full justify-start',
														{
															'flex items-center gap-4 text-left h-fit':
																selectedPatient !==
																null,
														}
													)}
												>
													<TriggerButtonContent
														patient={
															selectedPatient
														}
													/>
												</Button>
											</DrawerTrigger>
											<DrawerContent>
												<div className='mt-4 border-t'>
													<StatusList
														setOpen={setOpen}
														setSelectedPatient={
															setSelectedPatient
														}
														setSelectedPatientId={
															field.onChange
														}
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

export default SelectPatient;

function TriggerButtonContent({ patient }: { patient: Patient | null }) {
	return patient ? (
		<>
			<Avatar>
				<AvatarImage src={patient.image} alt={patient.name} />
				<AvatarFallback>
					{patient.name
						.split(' ')
						.map((name) => name[0].toUpperCase())
						.join('')}
				</AvatarFallback>
			</Avatar>
			<div>
				<div className='font-semibold'>{patient.name}</div>
				<div className='text-muted-foreground'>{patient.phone}</div>
			</div>
		</>
	) : (
		<>+ Select Patient</>
	);
}

function StatusList({
	setOpen,
	setSelectedPatient,
	setSelectedPatientId,
}: {
	setOpen: (open: boolean) => void;
	setSelectedPatient: (patient: Patient | null) => void;
	setSelectedPatientId: (patientId: string) => void;
}) {
	const [patients, setPatients] = useState<Patient[]>([]);
	const [loading, setLoading] = useState(false);

	const userInputCallback = useCallback(async (value: string) => {
		try {
			setLoading(true);
			const results = await getPatientsByName(value);
			if (results.length > 0) {
				setPatients(results);
			} else {
				setPatients([]);
			}
		} catch {
			setPatients([]);
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
				placeholder='Search by patient name or phone...'
				onValueChange={useDebounce(userInputCallback, 500)}
			/>
			<CommandList className='p-2'>
				<CommandGroup>
					{loading ? (
						<BounceLoader className='my-4' />
					) : patients.length === 0 ? (
						<CommandEmpty className='max-w-[12rem] lg:max-w-none text-muted-foreground text-sm text-center'>
							No patients found. Try a different search term.
						</CommandEmpty>
					) : (
						patients.map((patient) => (
							<CommandItem
								key={patient.id}
								value={patient.id}
								onSelect={(value) => {
									setSelectedPatient(patient);
									setSelectedPatientId(value);
									setOpen(false);
								}}
								className='flex items-center gap-4 cursor-pointer'
							>
								<Avatar>
									<AvatarImage
										src={patient.image}
										alt={patient.name}
									/>
									<AvatarFallback>
										{patient.name
											.split(' ')
											.map((name) =>
												name[0].toUpperCase()
											)
											.join('')}
									</AvatarFallback>
								</Avatar>
								<div>
									<div className='font-semibold'>
										{patient.name}
									</div>
									<div className='text-muted-foreground'>
										{patient.phone}
									</div>
								</div>
							</CommandItem>
						))
					)}
				</CommandGroup>
			</CommandList>
		</Command>
	);
}
