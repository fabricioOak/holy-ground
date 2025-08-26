import { FastifyInstance } from "fastify";
import { LoginDTO } from "../dto/auth.dto";

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
				description: "User logout",
				tags: ["Authentication"],
			},
		},
		authController.logout.bind(authController)
	);
}
