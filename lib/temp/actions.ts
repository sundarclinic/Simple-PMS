'use server';

import db from '@/db';
import { temporaryPages, TemporaryPage } from '@/db/schemas/temporaryPages';
import { v4 as uuid } from 'uuid';
import { ActionResponse } from '../types';
import { takeUniqueOrThrow } from '@/db/utils';
import { PMS_URL } from '../config';

export const getTemporaryPageBySourceId = async (sourceId: string) => {
	try {
		const page = await db.query.temporaryPages.findFirst({
			where: (pages, { eq, and, gt }) =>
				and(
					eq(pages.sourceId, sourceId),
					gt(pages.expiresAt, new Date())
				),
		});
		return page;
	} catch (error) {
		return null;
	}
};

export const getTemporaryPageBySlug = async (slug: string) => {
	try {
		const page = await db.query.temporaryPages.findFirst({
			where: (pages, { eq, and, gt }) =>
				and(eq(pages.slug, slug), gt(pages.expiresAt, new Date())),
		});
		return page;
	} catch (error) {
		return null;
	}
};

export const createTemporaryPage = async (
	data: Omit<
		TemporaryPage,
		'id' | 'slug' | 'createdAt' | 'updatedAt' | 'expiresAt'
	>
): Promise<ActionResponse & { url?: string }> => {
	return new Promise(async (resolve, reject) => {
		try {
			const id = uuid();
			const slug = uuid();
			const response = await db
				.insert(temporaryPages)
				.values({
					id,
					slug,
					...data,
					createdAt: new Date(),
					updatedAt: new Date(),
				})
				.returning({ insertedId: temporaryPages.id })
				.then(takeUniqueOrThrow);

			if (response.insertedId) {
				resolve({
					message: 'Temporary page created successfully',
					url: `${PMS_URL.toString()}t/${slug}`,
				});
			} else {
				reject({
					message: 'Failed to create temporary page',
				});
			}
		} catch (error) {
			reject({
				message: 'Failed to create temporary page',
			});
		}
	});
};
