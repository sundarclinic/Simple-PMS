'use client';

import { type ComponentProps } from 'react';

import { useFormStatus } from 'react-dom';
import { Button } from '@/components/ui/button';
import { RotateCw } from 'lucide-react';

type Props = ComponentProps<typeof Button> & {
	pendingText?: string;
};

export function SubmitButton({ children, pendingText, ...props }: Props) {
	const { pending } = useFormStatus();

	return (
		<Button
			{...props}
			type='submit'
			aria-disabled={props.disabled || pending}
			disabled={props.disabled || pending}
		>
			{pending ? (
				<RotateCw className='animate-spin mr-2' size={16} />
			) : null}
			{pending ? pendingText : children}
		</Button>
	);
}
