import { FastifyInstance } from "fastify";
import fp from "fastify-plugin";
import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "./schema/index";

async function dbConnector(server: FastifyInstance) {
	const pool = new Pool({
		connectionString: process.env.DATABASE_URL,
	});

	const connection = drizzle(pool, { schema });

	if (!connection) {
		throw new Error("Failed to connect to database");
	}

	server.decorate("Database", connection);
}

export default fp(dbConnector, { name: "db-connector" });
