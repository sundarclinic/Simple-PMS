import { useState } from 'react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from '@/components/ui/command';
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover';

const frameworks = [
	{
		value: 'next.js',
		label: 'Next.js',
	},
	{
		value: 'sveltekit',
		label: 'SvelteKit',
	},
	{
		value: 'nuxt.js',
		label: 'Nuxt.js',
	},
	{
		value: 'remix',
		label: 'Remix',
	},
	{
		value: 'astro',
		label: 'Astro',
	},
];

export default function SelectPatient() {
	const [open, setOpen] = useState(false);
	const [value, setValue] = useState('');
	return (
		<Card>
			<CardHeader>
				<CardTitle>Invoice For</CardTitle>
			</CardHeader>
			<CardContent>
				<div className='grid gap-6'>
					<div className='grid gap-3'>
						<Label htmlFor='status'>Patient</Label>
						<Popover open={open} onOpenChange={setOpen}>
							<PopoverTrigger asChild>
								<Button
									variant='outline'
									role='combobox'
									aria-expanded={open}
									className='w-full justify-between'
								>
									{value
										? frameworks.find(
												(framework) =>
													framework.value === value
										  )?.label
										: 'Select patient...'}
									<ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
								</Button>
							</PopoverTrigger>
							<PopoverContent className='w-full p-0'>
								<Command>
									<CommandInput placeholder='Search patients...' />
									<CommandList>
										<CommandEmpty>
											No framework found.
										</CommandEmpty>
										<CommandGroup>
											{frameworks.map((framework) => (
												<CommandItem
													key={framework.value}
													value={framework.value}
													onSelect={(
														currentValue
													) => {
														setValue(
															currentValue ===
																value
																? ''
																: currentValue
														);
														setOpen(false);
													}}
												>
													<Check
														className={cn(
															'mr-2 h-4 w-4',
															value ===
																framework.value
																? 'opacity-100'
																: 'opacity-0'
														)}
													/>
													{framework.label}
												</CommandItem>
											))}
										</CommandGroup>
									</CommandList>
								</Command>
							</PopoverContent>
						</Popover>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
