import z from 'zod';

export const loginSchema = z.object({
	email: z.string().trim().email({ message: 'Invalid email address.' }),
	password: z
		.string()
		.trim()
		.min(6, { message: 'Password must be at least 6 characters.' }),
});

export const forgotPasswordRequestSchema = z.object({
	email: z.string().trim().email({ message: 'Invalid email address.' }),
});

export const forgotPasswordResetSchema = z.object({
	password: z
		.string()
		.trim()
		.min(4, { message: 'Password must be at least 4 characters.' }),
});
