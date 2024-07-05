import React from 'react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Phone, Mail, CalendarDays, Sparkles, Clipboard } from 'lucide-react';

import { Patient } from '@/db/schemas/patients';
import { dateFormatter } from '@/lib/utils';

interface Props
	extends React.HTMLAttributes<React.ComponentPropsWithoutRef<typeof Card>> {
	patient: Patient;
}

const PatientDetails: React.FC<Props> = ({ patient }) => {
	return (
		<Card>
			<CardHeader>
				<CardTitle>Details</CardTitle>
			</CardHeader>
			<CardContent className='flex flex-wrap items-center gap-2'>
				<Badge className='gap-1 font-medium' variant='outline'>
					<Phone size={12} />
					<span>{patient.phone}</span>
				</Badge>
				{patient.email ? (
					<Badge className='gap-1 font-medium' variant='outline'>
						<Mail size={12} />
						<span>{patient.email}</span>
					</Badge>
				) : null}
				{patient.dob ? (
					<Badge className='gap-1 font-medium' variant='outline'>
						<CalendarDays size={12} />
						<span>{dateFormatter(new Date(patient.dob))}</span>
					</Badge>
				) : null}
				<Badge className='gap-1 font-medium' variant='outline'>
					<Sparkles size={12} />
					<span>{patient.age} years old</span>
				</Badge>
			</CardContent>
		</Card>
	);
};

export default PatientDetails;
