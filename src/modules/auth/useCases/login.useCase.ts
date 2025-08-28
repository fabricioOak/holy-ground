import { LoginInput } from "../auth.dto";
import { IUserRepository } from "../../users/users.repository";
import { IPasswordHasher } from "../../../shared/interfaces/passwordHasher";
import { ITokenService } from "../../../shared/interfaces/tokenService";

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

export class LoginUseCase {
	constructor(
		private userRepository: IUserRepository,
		private passwordHasher: IPasswordHasher,
		private tokenService: ITokenService
	) {}

	async execute(input: LoginInput): Promise<LoginResult> {
		try {
			const user = await this.userRepository.findByEmail(input.email);

			if (!user) {
				return {
					success: false,
					message: "User not found",
				};
			}

			const isPasswordValid = await this.passwordHasher.comparePassword(
				input.password,
				user.password
			);
			if (!isPasswordValid) {
				return {
					success: false,
					message: "Invalid credentials",
				};
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
		} catch (error) {
			return {
				success: false,
				message: "Internal server error",
			};
		}
	}
}
