import z from 'zod';

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
