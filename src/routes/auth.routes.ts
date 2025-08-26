import { FastifyInstance } from "fastify";
import { LoginDTO } from "../dto/auth.dto";
import fastifyCookie from "@fastify/cookie";

export async function authRoutes(server: FastifyInstance) {
	const { authController } = server.container.modules.auth;

	server.post(
		"/login",
		{
			schema: {
				body: LoginDTO,
				tags: ["Authentication"],
				description: "User login",
			},
		},
		authController.login.bind(authController)
	);
	server.post(
		"/logout",
		{
			onRequest: [server.authenticate],
			schema: {
				security: [{ fastifyCookie: [] }],
				description: "User logout",
				tags: ["Authentication"],
			},
		},
		authController.logout.bind(authController)
	);
}
