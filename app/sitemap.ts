import { MetadataRoute } from 'next';
import { PMS_URL } from '@/lib/config';

export default function sitemap(): MetadataRoute.Sitemap {
	return [
		{
			url: PMS_URL.toString(),
			lastModified: new Date(),
			changeFrequency: 'yearly',
			priority: 1,
		},
		{
			url: PMS_URL.toString() + 'login',
			lastModified: new Date(),
			changeFrequency: 'yearly',
			priority: 1,
		},
	];
}
