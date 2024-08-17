'use client';

import React, { useState, useEffect } from 'react';

import { buttonVariants } from '../ui/button';
import { RotateCw } from 'lucide-react';

import { toast } from 'sonner';
import { TemporaryPage } from '@/db/schemas/temporaryPages';
import {
	getTemporaryPageBySourceId,
	createTemporaryPage,
} from '@/lib/temp/actions';
import { PMS_URL } from '@/lib/config';
import { cn } from '@/lib/utils';
import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard';

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	sourceId: string;
	content: TemporaryPage['content'];
}

const TemporaryShare: React.FC<Props> = ({
	children,
	sourceId,
	content,
	...props
}) => {
	const [loading, setLoading] = useState(false);
	const [shareUrl, setShareUrl] = useState<string | null>(null);
	const { handleCopyToClipboard } = useCopyToClipboard();

	const getShareUrl = async () => {
		setLoading(true);
		try {
			const data = await getTemporaryPageBySourceId(sourceId);
			if (data !== undefined) {
				const url = `${PMS_URL.toString()}t/${data.slug}`;
				setShareUrl(url);
			}
		} catch (error) {
		} finally {
			setLoading(false);
		}
	};

	const createShareUrl = async () => {
		setLoading(true);
		try {
			const data = await createTemporaryPage({
				sourceId,
				content,
			});
			if (
				data.message === 'Temporary page created successfully' &&
				data.url
			) {
				setShareUrl(data.url);
				await handleCopyToClipboard(data.url, `${content} share URL`);
			}
		} catch (error) {
			toast.error('Failed to create share URL');
		} finally {
			setLoading(false);
		}
	};

	const handleCreateShareUrl = async () => {
		if (shareUrl) {
			await handleCopyToClipboard(shareUrl, `${content} share URL`);
			return;
		} else {
			await createShareUrl();
		}
	};

	useEffect(() => {
		getShareUrl();
	}, []);

	return (
		<button
			{...props}
			disabled={loading}
			className={cn(
				buttonVariants({ variant: 'ghost' }),
				'flex items-center p-0 m-0 h-fit'
			)}
			onClick={handleCreateShareUrl}
		>
			{loading ? (
				<RotateCw size={12} className='animate-spin mr-2' />
			) : null}
			<span>{children}</span>
		</button>
	);
};

export default TemporaryShare;
