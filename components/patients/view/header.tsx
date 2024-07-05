'use client';

import React, { useMemo, useState, useEffect } from 'react';

import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
	CardFooter,
} from '@/components/ui/card';
import { Button, buttonVariants } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Phone, Clipboard, ClipboardCheck, MoreHorizontal } from 'lucide-react';

import { toast } from 'sonner';
import { Patient } from '@/db/schemas/patients';
import { cn, dateFormatter } from '@/lib/utils';

interface Props
	extends React.HTMLAttributes<React.ComponentPropsWithoutRef<typeof Card>> {
	patient: Patient;
}

const PatientHeader: React.FC<Props> = ({ patient }) => {
	const randomImage = useMemo(() => {
		const images = ['clinic.png', 'consulatation.png', 'mri.png'];
		return images[Math.floor(Math.random() * images.length)];
	}, []);
	const [isCopied, setIsCopied] = useState(false);

	const handleCopyToClipboard = (text: string) => async () => {
		try {
			await navigator.clipboard.writeText(text);
			toast.success('Copied to clipboard');
			setIsCopied(true);
		} catch (error) {
			toast.error('Failed to copy to clipboard');
		}
	};

	useEffect(() => {
		if (isCopied) {
			const timer = setTimeout(() => {
				setIsCopied(false);
			}, 2000);
			return () => clearTimeout(timer);
		}
	}, [isCopied]);

	return (
		<Card className='overflow-hidden'>
			<CardHeader
				style={{
					backgroundImage: `url(/illustrations/${randomImage})`,
				}}
				className={`bg-cover bg-center bg-no-repeat h-14 md:h-32`}
			>
				<Avatar className='border-2 border-white w-16 h-16 md:w-24 md:h-24 relative md:-bottom-12'>
					<AvatarImage src={patient.image} alt={patient.name} />
					<AvatarFallback>
						{patient.name
							.split(' ')
							.map((name) => name[0].toUpperCase())
							.join('')}
					</AvatarFallback>
				</Avatar>
			</CardHeader>
			<CardContent className='pt-8 md:pt-14'>
				<div className='flex items-center'>
					<div className='flex-1'>
						<CardTitle>{patient.name}</CardTitle>
						<CardDescription>
							Patient since{' '}
							{dateFormatter(new Date(patient.createdAt))}
						</CardDescription>
					</div>
					<DropdownMenu>
						<DropdownMenuTrigger
							className={cn(
								buttonVariants({
									variant: 'ghost',
									size: 'icon',
								}),
								'rounded-full'
							)}
						>
							<MoreHorizontal size={20} />
						</DropdownMenuTrigger>
						<DropdownMenuContent>
							<DropdownMenuLabel>Actions</DropdownMenuLabel>
							<DropdownMenuSeparator />
							<DropdownMenuItem
								asChild
								className='cursor-pointer'
							>
								<Link
									href={`/dashboard/patients/edit/${patient.id}`}
								>
									Edit
								</Link>
							</DropdownMenuItem>
							<DropdownMenuItem>Delete</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</CardContent>
			<CardFooter className='flex flex-wrap gap-4 items-center'>
				<Button asChild variant='outline' className='gap-2'>
					<Link href={`tel:${patient.phone}`} target='_blank'>
						<Phone size={16} />
						Call
					</Link>
				</Button>
				{patient.email ? (
					<Button
						className='gap-2'
						variant='outline'
						onClick={handleCopyToClipboard(patient.email)}
					>
						{isCopied ? (
							<ClipboardCheck size={16} />
						) : (
							<Clipboard size={16} />
						)}
						<span>Copy Email</span>
					</Button>
				) : null}
			</CardFooter>
		</Card>
	);
};

export default PatientHeader;
