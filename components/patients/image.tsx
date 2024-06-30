import React from 'react';

import Image from 'next/image';
import { Upload } from 'lucide-react';
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	CardDescription,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

import { buttonVariants } from '../ui/button';
import { cn } from '@/lib/utils';

const PatientImage = () => {
	return (
		<Card className='overflow-hidden'>
			<CardHeader>
				<CardTitle>Patient Image</CardTitle>
				<CardDescription>
					Upload or change patient image below.
				</CardDescription>
			</CardHeader>
			<CardContent>
				<div className='grid gap-2'>
					<Image
						alt='Product image'
						className='aspect-square w-full rounded-md object-cover'
						height='300'
						src='/placeholder.svg'
						width='300'
					/>
					<Label
						className={cn(
							buttonVariants({ variant: 'outline' }),
							'flex w-full items-center justify-center rounded-md border border-dashed gap-1 cursor-pointer'
						)}
					>
						<Upload className='text-muted-foreground' size={16} />
						<span>Upload</span>
						<Input
							type='file'
							accept='image/*'
							className='hidden'
						/>
					</Label>
				</div>
			</CardContent>
		</Card>
	);
};

export default PatientImage;
