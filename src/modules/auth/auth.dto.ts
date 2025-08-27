import { Type } from "@sinclair/typebox";

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

export const LoginResponseDTO = Type.Object({
	user: Type.Object({
		id: Type.String(),
		email: Type.String(),
		firstName: Type.String(),
		lastName: Type.String(),
		role: Type.String(),
	}),
	permissions: Type.Array(Type.String()),
});

export type LoginInput = typeof LoginDTO.static;
export type LoginResult = typeof LoginResponseDTO.static;
