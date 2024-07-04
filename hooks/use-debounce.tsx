import { useCallback, useRef } from 'react';

export const useDebounce = (callback: (args: any) => void, delay: number) => {
	const timeout = useRef<NodeJS.Timeout>();

	return useCallback(
		(args: any) => {
			const later = () => {
				clearTimeout(timeout.current);
				callback(args);
			};

			clearTimeout(timeout.current);
			timeout.current = setTimeout(later, delay);
		},
		[callback, delay]
	);
};
