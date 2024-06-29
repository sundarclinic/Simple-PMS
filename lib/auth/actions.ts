'use server';

import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { createClient } from '@/utils/supabase/server';
import { loginSchema } from './types';
import { FormState } from '@/lib/types';

export async function onSubmitLoginAction(
	_: FormState,
	data: FormData
): Promise<FormState> {
	const formData = Object.fromEntries(data);
	const parsed = loginSchema.safeParse(formData);

	if (!parsed.success) {
		const fields: Record<string, string> = {};
		for (const key of Object.keys(formData)) {
			fields[key] = formData[key].toString();
		}
		return {
			message: 'Invalid form data',
			fields,
			issues: parsed.error.issues.map((issue) => issue.message),
		};
	}

	const supabase = createClient();

	const { error } = await supabase.auth.signInWithPassword(parsed.data);

	if (error) {
		return {
			message: 'Could not authenticate user',
			issues: [error.message],
			fields: parsed.data,
		};
	}

	redirect('/dashboard');
}

export const onSignOutAction = async (
	_: FormState,
	__: FormData
): Promise<FormState> => {
	const supabase = createClient();
	const { error } = await supabase.auth.signOut();
	if (error) {
		return {
			message: 'Unable to logout.',
			issues: [error.message],
		};
	}
	redirect('/login');
};
