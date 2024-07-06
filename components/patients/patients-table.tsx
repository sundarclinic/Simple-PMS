'use client';

import React from 'react';

import { DataTable } from '@/components/ui/data-table';

import { Patient } from '@/db/schemas/patients';
import { patientColums } from './columns';

interface Props
	extends React.HTMLAttributes<
		React.ComponentPropsWithoutRef<typeof DataTable>
	> {
	patients: Patient[];
}

const PatientsTable: React.FC<Props> = ({ patients }) => {
	return <DataTable columns={patientColums} data={patients} />;
};

export default PatientsTable;
