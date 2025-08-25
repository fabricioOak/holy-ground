import type { FastifyInstance } from "fastify";
import fjwt from "@fastify/jwt";
import fp from "fastify-plugin";

const jwtPlugin = async (server: FastifyInstance) => {
	await server.register(fjwt, {
		secret: process.env.JWT_SECRET?.toString() ?? "secret",
		sign: {
			expiresIn: process.env.JWT_EXPIRES_IN?.toString() ?? "secret",
		},
	});
};

export default fp(jwtPlugin, { name: "jwt-plugin" });
