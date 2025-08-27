import fastify from "fastify";
import swaggerPlugin from "../../../plugins/swagger.plugin.ts";
import jwtPlugin from "../../../plugins/jwt.plugin.ts";
import cookiePlugin from "../../../plugins/cookie.plugin.ts";
import helmetPlugin from "../../../plugins/helmet.plugin.ts";
import rateLimitPlugin from "../../../plugins/rate-limit.plugin.ts";
import dbConnector from "../../../shared/infra/db/index.ts";
import { MainContainer } from "../../container/index.ts";
import mainRouter from "./routes";
import containerPlugin from "../../container/container.plugin.ts";

export async function buildServer() {
	const server = await fastify({
		logger: {
			transport: {
				target: "pino-pretty",
				options: {
					colorize: true,
					translateTime: "HH:MM:ss Z",
					ignore: "pid,hostname",
				},
			},
		},
	});

	await server.register(jwtPlugin);
	await server.register(cookiePlugin);
	await server.register(swaggerPlugin);
	await server.register(helmetPlugin);
	await server.register(rateLimitPlugin);
	await server.register(dbConnector);
	await server.register(containerPlugin);
	await server.register(mainRouter, { prefix: "/api" });

	await server.ready();

	return server;
}
