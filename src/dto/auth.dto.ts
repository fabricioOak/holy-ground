import { Type } from "@sinclair/typebox";
import { EUserRoles } from "../common/enums/user.enum";

export const LoginDTO = Type.Object({
	email: Type.String({
		format: "email",
		description: "User email",
	}),
	password: Type.String({
		minLength: 6,
		description: "User password",
	}),
});

export const CreateUserDTO = Type.Object({
	email: Type.String({ format: "email" }),
	password: Type.String({ minLength: 6 }),
	firstName: Type.String({ minLength: 2 }),
	lastName: Type.String({ minLength: 2 }),
	role: Type.Enum(EUserRoles),
});

export const UserResponseDTO = Type.Object({
	id: Type.String(),
	email: Type.String(),
	firstName: Type.String(),
	lastName: Type.String(),
	role: Type.Enum(EUserRoles),
	isActive: Type.Boolean(),
	createdAt: Type.Date(),
	updatedAt: Type.Date(),
});

export const LoginResponseDTO = Type.Object({
	success: Type.Boolean(),
	data: Type.Object({
		token: Type.String(),
		user: UserResponseDTO,
		permissions: Type.Array(Type.String()),
	}),
	message: Type.String(),
});

export type LoginInput = typeof LoginDTO.static;
export type CreateUserInput = typeof CreateUserDTO.static;
export type UserResponse = typeof UserResponseDTO.static;
export type LoginResponse = typeof LoginResponseDTO.static;
