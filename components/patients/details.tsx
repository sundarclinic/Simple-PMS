import React from 'react';

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';

import { useFormContext } from 'react-hook-form';
import { InsertPatient } from '@/db/schemas/patients';

const PatientDetails = () => {
	const { control } = useFormContext<InsertPatient>();
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
					<FormField
						control={control}
						name='name'
						render={({ field }) => (
							<FormItem className='grid gap-3'>
								<FormLabel>Name</FormLabel>
								<FormControl>
									<Input
										placeholder='Siva Kumar'
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={control}
						name='phone'
						render={({ field }) => (
							<FormItem className='grid gap-3'>
								<FormLabel>Phone</FormLabel>
								<FormControl>
									<Input
										placeholder='9876543210'
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={control}
						name='address'
						render={({ field }) => (
							<FormItem className='grid gap-3'>
								<FormLabel>Address</FormLabel>
								<FormControl>
									<Textarea
										placeholder='Enter address here'
										{...field}
										className='min-h-32'
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={control}
						name='email'
						render={({ field }) => (
							<FormItem className='grid gap-3'>
								<FormLabel>Email</FormLabel>
								<FormControl>
									<Input
										placeholder='ekta@gmail.com'
										type='email'
										{...field}
									/>
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

export default PatientDetails;
