import { FastifyInstance } from "fastify";
import { LoginDTO, LoginResponseDTO } from "./auth.dto";
import { ApiResponse } from "../../shared/utils/responses";
import { AuthController } from "./auth.controller";

export async function authRoutes(server: FastifyInstance) {
	const { login, logout } = server.container.resolve(AuthController);

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
		login
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
		logout
	);
}
