import type {
	FastifyInstance,
	FastifyReply,
	FastifyRequest,
	HookHandlerDoneFunction,
} from "fastify";
import fCookie from "@fastify/cookie";
import fp from "fastify-plugin";
import type { FastifyJWT } from "@fastify/jwt";

const cookiePlugin = async (server: FastifyInstance) => {
	await server.register(fCookie, {
		secret: process.env.COOKIE_SECRET_KEY?.toString() ?? "secret",
		hook: "preHandler",
	});

	server.decorate(
		"authenticate",
		async (req: FastifyRequest, reply: FastifyReply) => {
			try {
				const token = req.cookies.access_token;

				if (!token) {
					return reply.status(401).send({
						success: false,
						data: null,
						message: "Token not found",
					});
				}

				const decoded = req.jwt.verify<FastifyJWT["user"]>(token);
				req.user = decoded;
			} catch (err) {
				return reply.status(401).send({
					success: false,
					data: null,
					message: "Unauthorized",
				});
			}
		}
	);

	server.addHook(
		"preHandler",
		(
			request: FastifyRequest,
			reply: FastifyReply,
			next: HookHandlerDoneFunction
		) => {
			request.jwt = server.jwt;
			return next();
		}
	);
};

export default fp(cookiePlugin);
