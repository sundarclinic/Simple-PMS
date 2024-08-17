import React from 'react';

import Link from 'next/link';

import { Patient } from '@/db/schemas/patients';

interface Props extends React.HTMLAttributes<'div'> {
	patient: Patient;
}

const PatientDetails: React.FC<Props> = ({ patient }) => {
	return (
		<div className='grid gap-3'>
			<div className='font-semibold'>Patient Information</div>
			<dl className='grid gap-3'>
				<div className='flex items-center justify-between'>
					<dt className='text-muted-foreground'>Patient</dt>
					<dd>{patient.name}</dd>
				</div>
				<div className='flex items-center justify-between'>
					<dt className='text-muted-foreground'>Email</dt>
					<dd>
						{patient.email ? (
							<Link
								href={`mailto:${patient.email}`}
								target='_blank'
								className='hover:underline'
							>
								{patient.email}
							</Link>
						) : (
							'Not provided'
						)}
					</dd>
				</div>
				<div className='flex items-center justify-between'>
					<dt className='text-muted-foreground'>Phone</dt>
					<dd>
						<Link
							href={`tel:${patient.phone}`}
							target='_blank'
							className='hover:underline'
						>
							{patient.phone}
						</Link>
					</dd>
				</div>
			</dl>
		</div>
	);
};

export default PatientDetails;
