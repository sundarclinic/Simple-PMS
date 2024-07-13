import { MetadataRoute } from 'next';
import { PMS_URL } from '@/lib/config';

export default function robots(): MetadataRoute.Robots {
	return {
		rules: {
			userAgent: '*',
			allow: ['/'],
			disallow: ['/dashboard/'],
		},
		sitemap: PMS_URL.toString() + '/sitemap.xml',
	};
}
