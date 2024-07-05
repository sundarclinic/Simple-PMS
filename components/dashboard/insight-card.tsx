import React from 'react';

import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface Props
	extends React.HTMLAttributes<React.ComponentPropsWithoutRef<typeof Card>> {
	label: string;
	value: string | number;
	percentage: number;
}

const MAXIMUM_PERCENTAGE = 100;

const InsightCard: React.FC<Props> = ({ label, percentage, value }) => {
	const percentagePrint = percentage.toFixed(1);
	const progressPercentage = Math.min(
		MAXIMUM_PERCENTAGE,
		Math.abs(percentage)
	);

	return (
		<Card className='flex flex-col'>
			<CardHeader className='pb-2'>
				<CardDescription>{label}</CardDescription>
				<CardTitle className='text-4xl'>{value}</CardTitle>
			</CardHeader>
			<CardContent>
				<div
					className='text-xs text-muted-foreground'
					title={`${percentage}%`}
				>
					{percentagePrint}% from last week
				</div>
			</CardContent>
			<CardFooter className='mt-auto'>
				<Progress
					value={progressPercentage}
					aria-label={`${percentagePrint}% ${
						percentage >= 0 ? 'increase' : 'decrease'
					}`}
				/>
			</CardFooter>
		</Card>
	);
};

export default InsightCard;
