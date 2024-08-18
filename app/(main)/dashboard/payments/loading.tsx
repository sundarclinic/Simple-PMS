import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
	return (
		<div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
			<Skeleton className='h-20 w-full rounded-md' />
			<Skeleton className='h-20 w-full rounded-md' />
			<Skeleton className='h-20 w-full rounded-md' />
			<Skeleton className='h-20 w-full rounded-md' />
			<Skeleton className='h-20 w-full rounded-md' />
			<Skeleton className='h-20 w-full rounded-md' />
		</div>
	);
}
