import fastify from "fastify";
import swaggerPlugin from "./plugins/swagger.plugin.ts";
import jwtPlugin from "./plugins/jwt.plugin.ts";
import cookiePlugin from "./plugins/cookie.plugin.ts";
import helmetPlugin from "./plugins/helmet.plugin.ts";
import rateLimitPlugin from "./plugins/rate-limit.plugin.ts";
import dbConnector from "./db/index.ts";

const server = fastify({
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

server.register(jwtPlugin);
server.register(cookiePlugin);
server.register(swaggerPlugin);
server.register(helmetPlugin);
server.register(rateLimitPlugin);
server.register(dbConnector);

export { server };
