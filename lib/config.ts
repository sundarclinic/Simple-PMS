export const PMS_URL = new URL(
	process.env.NODE_ENV === 'production'
		? 'https://pms.sundarclinic.com'
		: 'http://localhost:3000'
);

export const CLINIC_URL = new URL('https://sundarclinic.com');
export const CLINIC_LOCATION_URL = new URL(
	'https://goo.gl/maps/qp2T6itZ5gp7wCJr8'
);
