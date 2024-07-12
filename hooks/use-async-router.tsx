import { useEffect, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';

export function useAsyncRouter() {
	const pathname = usePathname();
	const router = useRouter();
	const resolvePath = useRef<Function | null>(null);

	const pushCallback = (href: string, callback?: Function) => {
		router.push(href);
		if (callback) {
			resolvePath.current = callback;
		}
	};

	const push = (href: string) => {
		return new Promise((resolve) => pushCallback(href, resolve));
	};

	useEffect(() => {
		resolvePath.current?.();
	}, [pathname]);

	return {
		...router,
		push,
	};
}
