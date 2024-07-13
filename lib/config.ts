export const PMS_URL = new URL(
	process.env.NODE_ENV === 'production'
		? 'https://pms.sundarclinic.com'
		: 'http://localhost:3000'
);
