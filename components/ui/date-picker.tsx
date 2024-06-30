'use client';

import * as React from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover';

interface Props extends React.ComponentPropsWithoutRef<typeof Popover> {
	date: Date | undefined;
	onSelect: (date: Date | undefined) => void;
}

export const DatePicker: React.FC<Props> = ({ date, onSelect }) => {
	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button
					variant={'outline'}
					className={cn(
						'justify-start text-left font-normal',
						!date && 'text-muted-foreground'
					)}
				>
					<CalendarIcon className='mr-2 h-4 w-4' />
					{date ? format(date, 'PPP') : <span>Pick a date</span>}
				</Button>
			</PopoverTrigger>
			<PopoverContent className='w-auto p-0'>
				<Calendar
					mode='single'
					selected={date}
					onDayClick={onSelect}
					initialFocus
					disabled={(date) =>
						date > new Date() || date < new Date('1900-01-01')
					}
				/>
			</PopoverContent>
		</Popover>
	);
};
