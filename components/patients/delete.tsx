import React from 'react';

import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';

const DeletePatient = () => {
	return (
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
	);
};

export default DeletePatient;
