import "dotenv/config";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";

async function runMigrations() {
  console.log("⏳ Running migrations...");

  const start = Date.now();

  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not set in environment variables");
  }

  const migrationClient = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  const db = drizzle(migrationClient);

  try {
    await migrate(db, { migrationsFolder: "./drizzle" });
    console.log("✅ Migrations completed successfully!");
  } catch (error) {
    console.error("❌ Error running migrations:", error);
    process.exit(1);
  } finally {
    await migrationClient.end();
    const end = Date.now();
    console.log(`🏁 Finished in ${end - start}ms`);
  }
}

runMigrations();
