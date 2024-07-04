import React from 'react';
import { cn } from '@/lib/utils';

interface Props
	extends React.HTMLAttributes<React.ComponentPropsWithoutRef<'div'>> {}

const BounceLoader: React.FC<Props> = ({ className, ...props }) => {
	return (
		<div
			className={cn(
				'flex items-center justify-center space-x-2',
				className
			)}
		>
			<div className='h-2 w-2 animate-bounce rounded-full bg-red-500 [animation-delay:-0.3s]'></div>
			<div className='h-2 w-2 animate-bounce rounded-full bg-red-500 [animation-delay:-0.13s]'></div>
			<div className='h-2 w-2 animate-bounce rounded-full bg-red-500'></div>
		</div>
	);
};

export default BounceLoader;
