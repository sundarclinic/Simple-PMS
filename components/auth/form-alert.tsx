import React from 'react';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, Info } from 'lucide-react';

import { FormState } from '@/lib/types';

interface Props extends React.ComponentPropsWithoutRef<typeof Alert> {
	state: FormState;
}

const FormAlert: React.FC<Props> = ({ state }) => {
	return state?.message !== '' ||
		(state.issues && state.issues?.length > 0) ? (
		<Alert
			variant={
				state?.message !== '' && !state.issues
					? 'default'
					: 'destructive'
			}
		>
			{state?.message !== '' && !state.issues ? (
				<Info size={16} />
			) : (
				<AlertCircle size={16} />
			)}
			<AlertTitle>
				{state?.message !== '' && !state.issues
					? state.message
					: 'Error'}
			</AlertTitle>
			<AlertDescription>
				{state?.issues?.map((issue, index) => (
					<p key={`issue-${index}`}>{issue}</p>
				))}
			</AlertDescription>
		</Alert>
	) : null;
};

export default FormAlert;
