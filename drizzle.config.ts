import { defineConfig } from "drizzle-kit";

if (!process.env.DATABASE_URL) {
	throw new Error("The DATABASE_URL env is required.");
}

export default defineConfig({
	schema: "./src/shared/infra/db/schema",
	out: "./src/shared/infra/db/migrations",
	dialect: "postgresql",
	casing: "snake_case",
	dbCredentials: {
		url: process.env.DATABASE_URL,
	},
	verbose: true,
	strict: true,
});
