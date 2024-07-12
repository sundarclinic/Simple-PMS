'use client';

import React, { useCallback, useState } from 'react';

import { Button } from '@/components/ui/button';
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from '@/components/ui/command';
import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer';
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover';
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from '@/components/ui/tooltip';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Search } from 'lucide-react';
import BounceLoader from '../ui/bounce-loader';

import { useRouter } from 'next/navigation';
import { useMediaQuery } from '@/hooks/use-media-query';
import { Patient } from '@/db/schemas/patients';
import { useDebounce } from '@/hooks/use-debounce';
import { getPatientsByName } from '@/lib/patients/actions';
import { toast } from 'sonner';
import { sleep } from '@/lib/utils';

const PatientSearch = () => {
	const [open, setOpen] = useState(false);
	const isDesktop = useMediaQuery('(min-width: 768px)');

	if (isDesktop) {
		return (
			<Popover open={open} onOpenChange={setOpen}>
				<PopoverTrigger asChild>
					<Button
						variant='ghost'
						size='icon'
						className='ml-auto rounded-lg'
					>
						<SearchButton />
					</Button>
				</PopoverTrigger>
				<PopoverContent className='p-0' align='start' side='left'>
					<StatusList setOpen={setOpen} />
				</PopoverContent>
			</Popover>
		);
	}

	return (
		<Drawer open={open} onOpenChange={setOpen}>
			<DrawerTrigger asChild>
				<Button
					variant='ghost'
					size='icon'
					className='ml-auto rounded-lg'
				>
					<SearchButton />
				</Button>
			</DrawerTrigger>
			<DrawerContent>
				<div className='mt-4 border-t'>
					<StatusList setOpen={setOpen} />
				</div>
			</DrawerContent>
		</Drawer>
	);
};

export default PatientSearch;

function SearchButton() {
	return (
		<Tooltip>
			<TooltipTrigger asChild>
				<Search className='h-4 w-4 shrink-0 text-muted-foreground' />
			</TooltipTrigger>
			<TooltipContent side='left' align='center'>
				<p>Search for patients</p>
			</TooltipContent>
		</Tooltip>
	);
}

function StatusList({ setOpen }: { setOpen: (open: boolean) => void }) {
	const router = useRouter();
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

	const handleRedirectToPatient = async (patientId: string) => {
		setOpen(false);
		toast.promise(
			new Promise(async (resolve) => {
				await sleep(1000);
				void router.push(`/dashboard/patients/${patientId}`);
				resolve(void 0);
			}),
			{
				loading: 'Redirecting to patient profile...',
				success: 'Viewing patient',
				error: 'Error finding patient',
				dismissible: true,
				duration: 3000,
			}
		);
	};

	return (
		<Command shouldFilter={false}>
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
									handleRedirectToPatient(value);
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
