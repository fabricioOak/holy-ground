import fastify from "fastify";
import swaggerPlugin from "../../../plugins/swagger.plugin";
import jwtPlugin from "../../../plugins/jwt.plugin";
import cookiePlugin from "../../../plugins/cookie.plugin";
import helmetPlugin from "../../../plugins/helmet.plugin";
import rateLimitPlugin from "../../../plugins/rate-limit.plugin";
import dbConnector from "../../../shared/infra/db/index";
import mainRouter from "./routes";
import containerPlugin from "../../container/container.plugin";
import { ValidationError } from "../../utils/validationError";

const loggerConfig = {
	transport: {
		target: "pino-pretty",
		options: {
			colorize: true,
			translateTime: "HH:MM:ss Z",
			ignore: "pid,hostname",
		},
	},
};

export async function buildServer() {
	const server = await fastify({
		logger: process.env.NODE_ENV === "production" ? false : loggerConfig,
	});

	server.setErrorHandler((error, request, reply) => {
		if (error instanceof ValidationError) {
			return reply.status(400).send({
				success: false,
				data: null,
				message: error.message,
			});
		}

		reply.status(500).send({
			success: false,
			data: null,
			message: error.message,
		});
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
