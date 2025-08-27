import { FastifyInstance } from "fastify";
import fp from "fastify-plugin";
import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import { schemas } from "./schema/index";

const pool = new Pool({
	connectionString: process.env.DATABASE_URL,
});
const connection = drizzle(pool, { schema: schemas });

export type DbConnection = typeof connection;

async function dbConnector(server: FastifyInstance) {
	if (!connection) {
		throw new Error("Failed to connect to database");
	}
	server.log.info("Database connection successful.");
	server.decorate("db", connection);
}

export default fp(dbConnector, { name: "db-connector" });
