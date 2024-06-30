'use client';

import React, { useRef } from 'react';

import Link from 'next/link';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { SubmitButton } from '../ui/submit-button';
import { PasswordInput } from '../ui/password-input';
import FormAlert from './form-alert';

import { useFormState, useFormStatus } from 'react-dom';
import z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { loginSchema } from '@/lib/auth/types';
import { onSubmitLoginAction } from '@/lib/auth/actions';

const LoginForm = () => {
	const formRef = useRef<HTMLFormElement>(null);
	const [state, formAction] = useFormState(onSubmitLoginAction, {
		message: '',
	});

	const form = useForm<z.infer<typeof loginSchema>>({
		resolver: zodResolver(loginSchema),
		defaultValues: {
			email: '',
			password: '',
			...(state?.fields ?? {}),
		},
	});

	const onSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
		await form.trigger();
		if (form.formState.isValid) {
			formRef.current?.requestSubmit();
		} else {
			e.preventDefault();
		}
	};

	return (
		<Form {...form}>
			<form
				ref={formRef}
				className='grid gap-4'
				action={formAction}
				onSubmit={onSubmit}
			>
				<FormAlert state={state} />
				<FormField
					control={form.control}
					name='email'
					render={({ field }) => {
						const { pending } = useFormStatus();
						return (
							<FormItem className='grid gap-2'>
								<FormLabel>Email</FormLabel>
								<FormControl>
									<Input
										placeholder='joestar@example.com'
										{...field}
										disabled={pending}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						);
					}}
				/>
				<FormField
					control={form.control}
					name='password'
					render={({ field }) => {
						const { pending } = useFormStatus();
						return (
							<FormItem className='grid gap-2'>
								<FormControl className='-order-1'>
									<PasswordInput
										{...field}
										disabled={pending}
									/>
								</FormControl>
								<div className='flex items-center -order-2'>
									<FormLabel htmlFor='password'>
										Password
									</FormLabel>
									<Link
										href='/forgot-password'
										className='ml-auto inline-block text-sm underline'
									>
										Forgot your password?
									</Link>
								</div>
								<FormMessage />
							</FormItem>
						);
					}}
				/>
				<SubmitButton pendingText='Logging in...'>Login</SubmitButton>
			</form>
		</Form>
	);
};

export default LoginForm;
