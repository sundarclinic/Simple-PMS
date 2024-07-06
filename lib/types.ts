import z from 'zod';

const paymentsSchema = z.object({
	id: z.string(),
	invoice_id: z.string(),
	amount: z.number().min(1),
	date: z.string(),
});

export type Payment = z.infer<typeof paymentsSchema>;

export type FormState = {
	message: string;
	fields?: Record<string, string>;
	issues?: string[];
};

export type ActionResponse = {
	message: string;
};

export type PageParams = {
	params: {};
	searchParams?: { [key: string]: string | string[] | undefined };
};
