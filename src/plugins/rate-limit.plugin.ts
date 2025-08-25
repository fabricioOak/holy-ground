import { FastifyInstance } from "fastify";
import fp from "fastify-plugin";
import fastifyRateLimit from "@fastify/rate-limit";

const rateLimitPlugin = async (server: FastifyInstance) => {
	await server.register(fastifyRateLimit, {
		max: 100,
		timeWindow: "1 minute",
	});
};

export default fp(rateLimitPlugin, { name: "rate-limit-plugin" });
