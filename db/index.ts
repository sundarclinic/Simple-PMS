import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';

import * as patients from './schemas/patients';
import * as invoices from './schemas/invoices';
import * as payments from './schemas/payments';

export const client = postgres(process.env.DATABASE_URL!, { prepare: false });
const db = drizzle(client, {
	schema: { ...patients, ...invoices, ...payments },
});

export default db;
