import { IUserRepository } from "../users.repository";
import { CreateUserInput, UserResponse } from "../user.dto";
import { IPasswordHasher } from "../../../shared/interfaces/passwordHasher";

export interface CreateUserResult {
	success: boolean;
	data?: UserResponse;
	message: string;
}

export class CreateUserUseCase {
	constructor(
		private userRepository: IUserRepository,
		private passwordHasher: IPasswordHasher
	) {}

	async execute(input: CreateUserInput): Promise<CreateUserResult> {
		try {
			const existingUser = await this.userRepository.findByEmail(input.email);

			if (existingUser?.email === input.email) {
				return {
					success: false,
					message: "User already exists",
				};
			}

			const passwordHash = await this.passwordHasher.hashPassword(
				input.password
			);

			const user = await this.userRepository.create({
				...input,
				password: passwordHash,
			});

			return {
				success: true,
				data: user,
				message: "User created successfully",
			};
		} catch (error) {
			return {
				success: false,
				message: "User creation failed",
			};
		}
	}
}
