'use client';
import React, { useEffect } from 'react';

import { Button as UIButton } from '@/components/ui/button';
import { RotateCw } from 'lucide-react';

import { useFormStatus, useFormState } from 'react-dom';
import { onSignOutAction } from '@/lib/auth/actions';
import { toast } from 'sonner';

const LogoutButton = () => {
	const [state, formAction] = useFormState(onSignOutAction, { message: '' });

	useEffect(() => {
		if (state?.message) {
			toast.error(state.message, {
				description: state.issues?.join(' '),
			});
		}
	}, [state.message]);

	return (
		<form action={formAction}>
			<Button />
		</form>
	);
};

function Button() {
	const { pending } = useFormStatus();
	return (
		<UIButton
			variant={'secondary'}
			type='submit'
			disabled={pending}
			aria-disabled={pending}
			className='h-fit p-1.5 w-full'
		>
			{pending ? (
				<RotateCw className='animate-spin mr-2' size={16} />
			) : null}
			{pending ? 'Logging out...' : 'Logout'}
		</UIButton>
	);
}

export default LogoutButton;
