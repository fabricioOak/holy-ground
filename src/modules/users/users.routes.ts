import { FastifyInstance } from "fastify";
import { CreateUserDTO, UpdateUserDTO, UserResponseDTO } from "./user.dto";
import { ApiPaginated, ApiResponse } from "../../shared/utils/responses";
import { UserController } from "./users.controller";
import { authorize } from "../../shared/utils/permissions.util";
import { EUserRoles } from "../../shared/enums/user.enum";

export async function usersRoutes(server: FastifyInstance) {
	const {
		create,
		update,
		delete: deleteUser,
		readlist,
		readOne,
	} = server.container.resolve(UserController);

	server.get(
		"/",
		{
			preHandler: [
				server.authenticate,
				authorize({
					allowed: [EUserRoles.CEMETERY_ADMIN, EUserRoles.SUPER_ADMIN],
				}),
			],
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

	server.get(
		"/:id",
		{
			preHandler: [server.authenticate],
			schema: {
				response: {
					200: ApiResponse(UserResponseDTO),
					400: ApiResponse(null),
				},
				tags: ["Users"],
				description: "Returns a user by id",
			},
		},
		readOne
	);

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

	server.put(
		"/soft-delete/:id",
		{
			preHandler: [server.authenticate],
			schema: {
				response: {
					200: ApiResponse(null),
					400: ApiResponse(null),
				},
				tags: ["Users"],
				description: "Soft delete an existing user",
			},
		},
		deleteUser
	);
}
