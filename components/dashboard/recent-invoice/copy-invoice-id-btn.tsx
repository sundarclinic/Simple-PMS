'use client';

import React from 'react';

import { Button } from '@/components/ui/button';
import { Copy, CopyCheck } from 'lucide-react';

import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard';

interface Props
	extends React.HTMLAttributes<
		React.ComponentPropsWithoutRef<typeof Button>
	> {
	invoiceId: string;
}

const CopyInvoiceIdBtn: React.FC<Props> = ({ invoiceId }) => {
	const { isCopied, handleCopyToClipboard } = useCopyToClipboard();

	return (
		<Button
			size='icon'
			variant='outline'
			className='h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100 shrink-0'
			onClick={() => handleCopyToClipboard(invoiceId)}
		>
			{isCopied ? <CopyCheck size={16} /> : <Copy size={16} />}
			<span className='sr-only'>Copy Invoice ID</span>
		</Button>
	);
};

export default CopyInvoiceIdBtn;
