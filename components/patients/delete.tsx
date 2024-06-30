import React from 'react';

import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';

import { Patient } from '@/db/schemas/patients';

interface Props
	extends React.HTMLAttributes<React.ComponentPropsWithoutRef<typeof Card>> {
	patient: Patient | null;
}

const DeletePatient: React.FC<Props> = ({ patient }) => {
	return patient ? (
		<Card>
			<CardHeader>
				<CardTitle>Delete Patient</CardTitle>
				<CardDescription>
					Deleting a patient will remove all associated data.
				</CardDescription>
			</CardHeader>
			<CardContent>
				<div></div>
				<Button size='sm' variant='destructive'>
					Delete
				</Button>
			</CardContent>
		</Card>
	) : null;
};

export default DeletePatient;
