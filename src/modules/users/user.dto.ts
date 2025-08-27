import { Type } from "@sinclair/typebox";
import { EUserRoles } from "../../shared/enums/user.enum";

export const CreateUserDTO = Type.Object({
	email: Type.String({ format: "email" }),
	password: Type.String({ minLength: 6 }),
	firstName: Type.String({ minLength: 2 }),
	lastName: Type.String({ minLength: 2 }),
	role: Type.Enum(EUserRoles),
});

export const UpdateUserDTO = Type.Partial(
	Type.Omit(CreateUserDTO, ["password"])
);

export const ChangePasswordDTO = Type.Object({
	oldPassword: Type.String({ minLength: 6 }),
	newPassword: Type.String({ minLength: 6 }),
});

export const ReadListUsersDTO = Type.Object({
	page: Type.Optional(Type.Number({ minimum: 1, default: 1 })),
	limit: Type.Optional(Type.Number({ minimum: 1, maximum: 100, default: 20 })),
	search: Type.Optional(
		Type.String({
			description: "Search by name or email",
		})
	),
	role: Type.Optional(Type.Enum(EUserRoles)),
	isActive: Type.Optional(Type.Boolean()),
});

export const UserResponseDTO = Type.Object({
	id: Type.String(),
	email: Type.String(),
	firstName: Type.String(),
	lastName: Type.String(),
	role: Type.String(),
	isActive: Type.Boolean(),
	createdAt: Type.String(),
	updatedAt: Type.String(),
});

export const PaginatedUsersResponseDTO = Type.Object({
	success: Type.Boolean(),
	data: Type.Object({
		users: Type.Array(UserResponseDTO),
		pagination: Type.Object({
			page: Type.Number(),
			limit: Type.Number(),
			total: Type.Number(),
			totalPages: Type.Number(),
			hasNext: Type.Boolean(),
			hasPrev: Type.Boolean(),
		}),
	}),
	message: Type.String(),
});

export type CreateUserInput = typeof CreateUserDTO.static;
export type UpdateUserInput = typeof UpdateUserDTO.static;
export type ChangePasswordInput = typeof ChangePasswordDTO.static;
export type ReadListUsersQuery = typeof ReadListUsersDTO.static;
export type UserResponse = typeof UserResponseDTO.static;
export type PaginatedUsersResponse = typeof PaginatedUsersResponseDTO.static;
