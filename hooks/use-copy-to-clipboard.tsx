import { useState, useEffect, useCallback } from 'react';

export const useCopyToClipboard = () => {
	const [isCopied, setIsCopied] = useState(false);

	const handleCopyToClipboard = useCallback(
		(text: string): Promise<string> => {
			return new Promise(async (resolve, reject) => {
				try {
					await navigator.clipboard.writeText(text);
					setIsCopied(true);
					resolve('Copied to clipboard');
				} catch (error) {
					reject('Failed to copy to clipboard');
				}
			});
		},
		[]
	);

	useEffect(() => {
		if (isCopied) {
			const timer = setTimeout(() => {
				setIsCopied(false);
			}, 2000);
			return () => clearTimeout(timer);
		}
	}, [isCopied]);

	return { isCopied, handleCopyToClipboard };
};
