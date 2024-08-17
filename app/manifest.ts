import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
	return {
		name: 'Sundar Clinic - Patient Management System',
		short_name: 'Sundar Clinic - PMS',
		description: "Sundar Clinic's very own Patient Management System",
		start_url: '/',
		display: 'standalone',
		background_color: '#fff',
		theme_color: '#f00',
		icons: [
			{
				src: '/logo/logo-circle.png',
				sizes: '180x180',
				type: 'image/png',
			},
		],
	};
}
