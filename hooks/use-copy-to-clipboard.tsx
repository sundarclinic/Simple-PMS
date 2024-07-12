import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';

export const useCopyToClipboard = () => {
	const [isCopied, setIsCopied] = useState(false);

	const handleCopyToClipboard = useCallback(
		(text: string, key: string): Promise<void> => {
			return new Promise(async (resolve) => {
				try {
					await navigator.clipboard.writeText(text);
					setIsCopied(true);
					toast.success(`Copied ${key} to clipboard`);
					resolve();
				} catch (error) {
					toast.error(`Failed to copy ${key} to clipboard`);
					resolve();
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
