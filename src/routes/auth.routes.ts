import { FastifyInstance } from "fastify";
import { LoginDTO, LoginResponseDTO } from "../dto/auth.dto";
import { ApiResponse } from "../common/utils/responses";

export async function authRoutes(server: FastifyInstance) {
	const { authController } = server.container.modules.auth;

	server.post(
		"/login",
		{
			schema: {
				body: LoginDTO,
				response: {
					200: ApiResponse(LoginResponseDTO),
				},
				tags: ["Authentication"],
				description: "User login",
			},
		},
		authController.login.bind(authController)
	);

	server.post(
		"/logout",
		{
			preHandler: [server.authenticate],
			schema: {
				description: "User logout",
				tags: ["Authentication"],
			},
		},
		authController.logout.bind(authController)
	);
}
