const postgres = require('postgres');
const { drizzle } = require('drizzle-orm/postgres-js');
const { migrate } = require('drizzle-orm/postgres-js/migrator');

require('dotenv').config({ path: '.env.local' });

const pushMigrations = async () => {
  const migrationClient = postgres(process.env.DATABASE_URL, { max: 1 });
  console.log('Connected to database...');
  const migrationDb = drizzle(migrationClient);
  console.log('Migrating database...');
  await migrate(migrationDb, {
    migrationsFolder: './db/migrations/drizzle',
  });
  console.log('Migration complete!');
  await migrationClient.end();
  console.log('Database connection closed.');
}

pushMigrations();