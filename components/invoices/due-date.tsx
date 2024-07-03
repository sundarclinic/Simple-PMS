import { useState } from 'react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { DatePicker } from '@/components/ui/date-picker';

export default function InvoiceDueDate() {
	const [dueDate, setDueDate] = useState<Date>();
	return (
		<Card>
			<CardHeader>
				<CardTitle>Due Date</CardTitle>
			</CardHeader>
			<CardContent>
				<div className='grid gap-6'>
					<div className='grid gap-3'>
						<Label htmlFor='dueDate'>Date</Label>
						<DatePicker
							date={dueDate}
							onSelect={setDueDate}
							calendarProps={{
								disabled: (date) => date < new Date(),
							}}
						/>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
