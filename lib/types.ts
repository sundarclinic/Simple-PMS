import z from 'zod';

const patientsSchema = z.object({
	id: z.string(),
	name: z.string().min(1),
	age: z.number().min(1),
	phone: z.string(),
	image: z.string().nullable(),
	address: z.string().nullable(),
	email: z.string().email().nullable(),
	dob: z.string().nullable(),
});

const invoicesSchema = z.object({
	id: z.string(),
	patient_id: z.string(),
	amount: z.number().min(1),
	paid_amount: z.number().min(0).default(0),
	due_date: z.string(),
});

const paymentsSchema = z.object({
	id: z.string(),
	invoice_id: z.string(),
	amount: z.number().min(1),
	date: z.string(),
});

export type Patient = z.infer<typeof patientsSchema>;
export type Invoice = z.infer<typeof invoicesSchema>;
export type Payment = z.infer<typeof paymentsSchema>;

export type FormState = {
	message: string;
	fields?: Record<string, string>;
	issues?: string[];
};

export type PageParams = {
	params: {};
	searchParams?: { [key: string]: string | string[] | undefined };
};
