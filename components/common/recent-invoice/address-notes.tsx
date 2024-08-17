import React from 'react';

interface Props extends React.HTMLAttributes<'div'> {
	address: string | null;
	notes: string | null;
}

const AddressAndNotes: React.FC<Props> = ({ address, notes }) => {
	return (
		<div className='grid grid-cols-2'>
			<div className='grid gap-3'>
				<div className='font-semibold'>Address</div>
				<address className='grid gap-0.5 not-italic text-muted-foreground'>
					{address ? (
						<span>{address}</span>
					) : (
						<span>Not provided</span>
					)}
				</address>
			</div>
			<div className='grid gap-3'>
				<div className='font-semibold'>Notes</div>
				<span className='grid gap-0.5 not-italic text-muted-foreground'>
					{notes ? <span>{notes}</span> : <span>Not provided</span>}
				</span>
			</div>
		</div>
	);
};

export default AddressAndNotes;
