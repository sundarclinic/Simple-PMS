import React from 'react';

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

const PatientDetails = () => {
	return (
		<Card>
			<CardHeader>
				<CardTitle>Patient Details</CardTitle>
				<CardDescription>
					Enter or update patient details below.
				</CardDescription>
			</CardHeader>
			<CardContent>
				<div className='grid gap-6'>
					<div className='grid gap-3'>
						<Label htmlFor='name'>Name</Label>
						<Input
							id='name'
							type='text'
							className='w-full'
							defaultValue='Gamer Gear Pro Controller'
						/>
					</div>
					<div className='grid gap-3'>
						<Label htmlFor='phone'>Phone</Label>
						<Input
							id='phone'
							type='text'
							className='w-full'
							defaultValue='Gamer Gear Pro Controller'
						/>
					</div>
					<div className='grid gap-3'>
						<Label htmlFor='description'>Address</Label>
						<Textarea
							id='description'
							defaultValue='Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nisl nec ultricies ultricies, nunc nisl ultricies nunc, nec ultricies nunc nisl nec nunc.'
							className='min-h-32'
						/>
					</div>
				</div>
			</CardContent>
		</Card>
	);
};

export default PatientDetails;
