import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
// import { headers } from 'next/headers';

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

export function sleep(ms: number) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

// export function getIp(): string | null {
// 	let forwardedFor = headers().get('x-forwarded-for');
// 	let realIp = headers().get('x-real-ip');
// 	if (forwardedFor) {
// 		return forwardedFor.split(',')[0].trim();
// 	}
// 	if (realIp) return realIp.trim();
// 	return null;
// }
