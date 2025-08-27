import { FastifyInstance } from "fastify";
import fp from "fastify-plugin";
import { authRoutes } from "../../../../modules/auth/auth.routes";
import { usersRoutes } from "../../../../modules/users/users.routes";

async function mainRouter(server: FastifyInstance) {
	server.register(authRoutes, { prefix: "/auth" });
	server.register(usersRoutes, { prefix: "/users" });
}

// Declaramos que as rotas dependem que o 'container-plugin' já tenha rodado
export default fp(mainRouter, {
	name: "main-router",
	dependencies: ["container-plugin"],
});
