import fp from "fastify-plugin";
import {
	FastifyInstance,
	FastifyReply,
	FastifyRequest,
	HookHandlerDoneFunction,
} from "fastify";
import fastifySwagger from "@fastify/swagger";
import apiReferenceConfiguration from "@scalar/fastify-api-reference";
import { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import routes from "../routes";

const swaggerPlugin = async (server: FastifyInstance) => {
	if (process.env.NODE_ENV !== "production") {
		await server.register(fastifySwagger, {
			openapi: {
				info: {
					title: "Holy Ground API",
					description: "API documentation for Holy Ground",
					version: "0.1.0",
				},
			},
		});

		await server.register(apiReferenceConfiguration, {
			routePrefix: "/docs",
			hooks: {
				onRequest: function (
					request: FastifyRequest,
					reply: FastifyReply,
					next: HookHandlerDoneFunction
				) {
					next();
				},
				preHandler: function (
					request: FastifyRequest,
					reply: FastifyReply,
					next: HookHandlerDoneFunction
				) {
					next();
				},
			},
		});
	}

	server.withTypeProvider<TypeBoxTypeProvider>();
	server.register(routes);
};

export default fp(swaggerPlugin, { name: "swagger-plugin" });
