import { FastifyInstance } from "fastify";
import fp from "fastify-plugin";
import fastifyHelmet from "@fastify/helmet";

const helmetPlugin = async (server: FastifyInstance) => {
	if (process.env.NODE_ENV !== "production") {
		return;
	}
	await server.register(fastifyHelmet);
};

export default fp(helmetPlugin, { name: "helmet-plugin" });
