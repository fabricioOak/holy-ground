import { FastifyInstance } from "fastify";
import { authRoutes } from "./auth.routes";

export default async function (server: FastifyInstance) {
	await server.register(authRoutes, { prefix: "/auth" });
}
