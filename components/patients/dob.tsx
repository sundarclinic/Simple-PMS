import React from 'react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { CalendarDatePicker } from '@/components/ui/calendar-date-picker';

import { useFormContext } from 'react-hook-form';
import { InsertPatient } from '@/db/schemas/patients';

const PatientDateOfBirth = () => {
	const {
		control,
		register,
		formState: { isSubmitting },
	} = useFormContext<InsertPatient>();

	return (
		<Card>
			<CardHeader>
				<CardTitle>D.O.B</CardTitle>
			</CardHeader>
			<CardContent>
				<div className='grid gap-6'>
					<FormField
						control={control}
						name='dob'
						disabled={isSubmitting}
						render={({ field }) => {
							return (
								<FormItem className='grid gap-3'>
									<FormLabel>Date of Birth</FormLabel>
									<FormControl>
										<CalendarDatePicker
											date={{
												from: field.value,
											}}
											onDateSelect={({ from }) => {
												field.onChange(from);
											}}
											variant='outline'
											numberOfMonths={1}
											className='justify-start'
											yearsRange={160}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							);
						}}
					/>
					<FormField
						control={control}
						name='age'
						disabled={isSubmitting}
						render={({ field }) => (
							<FormItem className='grid gap-3'>
								<FormLabel>Age</FormLabel>
								<FormControl>
									<Input
										placeholder='21'
										type='number'
										{...field}
										{...register('age', {
											valueAsNumber: true,
										})}
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

export default PatientDateOfBirth;
