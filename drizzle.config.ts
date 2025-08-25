import type { Config } from "drizzle-kit";

export default {
	schema: "./src/db/schema/index.ts",
	out: "./src/db/migrations",
	dialect: "postgresql",
	verbose: true,
	strict: true,
} satisfies Config;
