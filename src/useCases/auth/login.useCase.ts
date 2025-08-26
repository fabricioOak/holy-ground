import { IUserRepository } from "../../repositories/user.repository";
import { IAuthService } from "../../services/auth.service";
import { LoginInput, UserResponse } from "../../dto/auth.dto";

export interface LoginResult {
	success: boolean;
	data?: {
		token: string;
		user: UserResponse;
		permissions: string[];
	};
	message: string;
}

export class LoginUseCase {
	constructor(
		private userRepository: IUserRepository,
		private authService: IAuthService
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

			const isPasswordValid = await this.authService.comparePassword(
				input.password,
				user.password
			);
			if (!isPasswordValid) {
				return {
					success: false,
					message: "Invalid credentials",
				};
			}

			const token = await this.authService.generateToken({
				userId: user.id,
				email: user.email,
				role: user.role,
			});

			const permissions = this.authService.getRolePermissions(user.role);

			return {
				success: true,
				data: {
					token,
					user,
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
