import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export const capitalize = (str: string) => {
	const words = str.split(/[\s-]+/);
	return words
		.map((word) => `${word.charAt(0).toUpperCase()}${word.slice(1)}`)
		.join(' ');
};

export const dateFormatter = (date: Date) => {
	return new Intl.DateTimeFormat('en-IN', {
		year: 'numeric',
		month: 'short',
		day: 'numeric',
	}).format(date);
};

export const currencyFormatter = (amount: number) => {
	return new Intl.NumberFormat('en-IN', {
		style: 'currency',
		currency: 'INR',
		maximumSignificantDigits: 3,
	}).format(amount);
};
