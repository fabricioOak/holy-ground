import { LoginInput } from "../auth.dto";
import { IUserRepository } from "../../users/users.repository";
import { IPasswordHasher } from "../../../shared/interfaces/passwordHasher";
import { ITokenService } from "../../../shared/interfaces/tokenService";
import { inject, injectable } from "tsyringe";
import { ValidationError } from "../../../shared/utils/validationError";

export interface LoginResult {
	success: boolean;
	data?: {
		token: string;
		user: {
			id: string;
			email: string;
			firstName: string;
			lastName: string;
			role: string;
		};
		permissions: string[];
	};
	message: string;
}

@injectable()
export class LoginUseCase {
	constructor(
		@inject("IUserRepository") private userRepository: IUserRepository,
		@inject("IPasswordHasher") private passwordHasher: IPasswordHasher,
		@inject("ITokenService") private tokenService: ITokenService
	) {}

	async execute(input: LoginInput): Promise<LoginResult> {
		const user = await this.userRepository.findByEmail(input.email);

		if (!user) {
			throw new ValidationError("User not found");
		}

		const isPasswordValid = await this.passwordHasher.comparePassword(
			input.password,
			user.password
		);
		if (!isPasswordValid) {
			throw new ValidationError("Invalid credentials");
		}

		const token = await this.tokenService.generate({
			id: user.id,
			email: user.email,
			role: user.role,
		});

		const permissions = [user.role];

		return {
			success: true,
			data: {
				token,
				user: {
					id: user.id,
					email: user.email,
					firstName: user.firstName,
					lastName: user.lastName,
					role: user.role,
				},
				permissions,
			},
			message: "Login successful",
		};
	}
}
