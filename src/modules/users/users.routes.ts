import { FastifyInstance } from "fastify";
import { CreateUserDTO, UserResponseDTO } from "./user.dto";

export async function usersRoutes(server: FastifyInstance) {
	const { userController } = server.container.modules.users;

	server.post(
		"/",
		{
			schema: {
				body: CreateUserDTO,
				response: {
					201: {
						type: "object",
						properties: {
							success: { type: "boolean" },
							data: UserResponseDTO,
							message: { type: "string" },
						},
					},
				},
				tags: ["Users"],
				description: "Criar novo usuário (apenas admins)",
			},
		},
		userController.create.bind(userController)
	);
}
