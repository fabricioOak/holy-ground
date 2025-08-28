import { FastifyInstance } from "fastify";
import { CreateUserDTO, UpdateUserDTO, UserResponseDTO } from "./user.dto";
import { ApiPaginated, ApiResponse } from "../../shared/utils/responses";
import { UserController } from "./users.controller";

export async function usersRoutes(server: FastifyInstance) {
	const { create, update, readlist } = server.container.resolve(UserController);

	server.post(
		"/",
		{
			schema: {
				body: CreateUserDTO,
				response: {
					201: ApiResponse(UserResponseDTO),
					400: ApiResponse(null),
				},
				tags: ["Users"],
				description: "Creates a new user",
			},
		},
		create
	);

	server.put(
		"/",
		{
			preHandler: [server.authenticate],
			schema: {
				body: UpdateUserDTO,
				response: {
					200: ApiResponse(UserResponseDTO),
					400: ApiResponse(null),
				},
				tags: ["Users"],
				description: "Updates an existing user",
			},
		},
		update
	);

	server.get(
		"/",
		{
			preHandler: [server.authenticate],
			schema: {
				response: {
					200: ApiPaginated(UserResponseDTO),
				},
				tags: ["Users"],
				description: "Returns a list of all users",
			},
		},
		readlist
	);
}
