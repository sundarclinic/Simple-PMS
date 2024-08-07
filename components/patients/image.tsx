import React, { useState, useEffect, useRef } from 'react';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Upload, CircleX, RotateCw } from 'lucide-react';
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	CardDescription,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from '@/components/ui/form';
import { Label } from '@/components/ui/label';

import { useFormContext } from 'react-hook-form';
import { InsertPatient } from '@/db/schemas/patients';
import { buttonVariants } from '../ui/button';
import { cn } from '@/lib/utils';
import { createClient } from '@/utils/supabase/client';
import { toast } from 'sonner';

const PatientImage = () => {
	const {
		control,
		getValues,
		setValue,
		watch,
		formState: { isSubmitting },
	} = useFormContext<InsertPatient>();
	const [file, setFile] = useState<File | null>(null);
	const [preview, setPreview] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);

	const supabase = createClient();
	const currentUuid = getValues('id');
	const inputRef = useRef<HTMLInputElement | null>(null);

	const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const files = event.target.files;
		if (files) {
			setFile(files[0]);
		}
	};

	useEffect(() => {
		if (file) {
			const reader = new FileReader();
			reader.readAsDataURL(file);
			// After preview is created upload the image to supabase storage
			// Save the public image url to the form
			reader.onloadend = async () => {
				setLoading(true);
				setPreview(reader.result as string);
				const { error } = await supabase.storage
					.from('patients')
					.upload(
						`images/${currentUuid}.${file.name.split('.').pop()}`,
						file,
						{
							cacheControl: '3600',
							contentType: file.type,
							upsert: true,
						}
					);
				if (error) {
					toast.error('Error', {
						description:
							'Failed to upload image. Please try again.',
					});
					setLoading(false);
					return;
				}
				const { data } = supabase.storage
					.from('patients')
					.getPublicUrl(
						`images/${currentUuid}.${file.name.split('.').pop()}`
					);
				if (!data) {
					setLoading(false);
					return;
				}
				setValue('image', data.publicUrl);
				setLoading(false);
				toast.success('Success', {
					description: 'Image uploaded successfully.',
				});
			};
		}
	}, [file]);

	// Clear the image from the form and supabase storage
	const handleClearFile = async () => {
		if (file) {
			setLoading(true);
			const { error } = await supabase.storage
				.from('patients')
				.remove([
					'images/' + currentUuid + '.' + file.name.split('.').pop(),
				]);
			setLoading(false);
			if (error) {
				toast.error('Error', {
					description: 'Failed to clear image. Please try again.',
				});
			} else {
				if (inputRef.current) {
					inputRef.current.value = '';
				}
				setFile(null);
				setPreview(null);
				setValue('image', undefined);
				toast.success('Success', {
					description: 'Image cleared successfully.',
				});
			}
		}
	};

	return (
		<Card className='overflow-hidden'>
			<CardHeader>
				<CardTitle>Patient Image</CardTitle>
				<CardDescription>
					Upload or change patient image below.
				</CardDescription>
			</CardHeader>
			<CardContent>
				<FormField
					control={control}
					name='image'
					render={({ field }) => (
						<FormItem className='grid gap-2'>
							<FormControl>
								<>
									<Image
										alt={getValues('name') || 'patient'}
										className={cn(
											'aspect-square w-full rounded-md object-cover'
										)}
										height='300'
										// If preview is available show the preview
										// If preview is not available but the form has a value show the value
										// If both are not available show a placeholder
										src={`${
											preview
												? preview
												: field.value
												? field.value
												: `https://api.dicebear.com/9.x/fun-emoji/svg?seed=${encodeURI(
														watch('name') ||
															'patient'
												  )}`
										}`}
										width='300'
									/>
									<div className='flex items-center gap-2'>
										<Label
											className={cn(
												buttonVariants({
													variant: 'outline',
												}),
												'flex w-full items-center justify-center rounded-md border border-dashed gap-1 cursor-pointer',
												{
													'cursor-default bg-muted text-muted-foreground hover:bg-muted hover:text-muted-foreground pointer-events-none':
														isSubmitting || loading,
												}
											)}
											aria-disabled={
												isSubmitting || loading
											}
										>
											{isSubmitting || loading ? (
												<RotateCw
													className='text-muted-foreground animate-spin'
													size={16}
												/>
											) : (
												<Upload
													className='text-muted-foreground'
													size={16}
												/>
											)}
											<span>
												{isSubmitting || loading
													? 'Updating...'
													: 'Upload'}
											</span>
											<Input
												ref={inputRef}
												type='file'
												accept='image/*'
												className='hidden'
												onChange={handleFileChange}
												disabled={
													isSubmitting || loading
												}
											/>
										</Label>
										{file && preview ? (
											<Button
												type='button'
												size={'icon'}
												variant={'destructive'}
												className='aspect-square shrink-0'
												onClick={handleClearFile}
												disabled={
													isSubmitting || loading
												}
												aria-disabled={
													isSubmitting || loading
												}
											>
												{loading ? (
													<RotateCw
														size={20}
														className='animate-spin'
													/>
												) : (
													<CircleX size={20} />
												)}
											</Button>
										) : null}
									</div>
								</>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
			</CardContent>
		</Card>
	);
};

export default PatientImage;
