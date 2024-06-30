'use client';

import React, { useState } from 'react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { DatePicker } from '../ui/date-picker';
import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { useFormContext } from 'react-hook-form';

import { InsertPatient } from '@/db/schemas/patients';

const PatientDateOfBirth = () => {
	const [dob, setDob] = useState<Date>();
	const { control, register } = useFormContext<InsertPatient>();

	return (
		<Card>
			<CardHeader>
				<CardTitle>D.O.B</CardTitle>
			</CardHeader>
			<CardContent>
				<div className='grid gap-6'>
					<div className='grid gap-3'>
						<Label htmlFor='status'>Date of Birth</Label>
						<DatePicker date={dob} onSelect={setDob} />
					</div>
					<FormField
						control={control}
						name='age'
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
