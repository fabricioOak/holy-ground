import { IUserRepository } from "../users.repository";
import { CreateUserInput, UserResponse } from "../user.dto";
import { IPasswordHasher } from "../../../shared/interfaces/passwordHasher";
import { injectable, inject } from "tsyringe";
import { ValidationError } from "../../../shared/utils/validationError";

export interface CreateUserResult {
	success: boolean;
	data?: UserResponse;
	message: string;
}

@injectable()
export class CreateUserUseCase {
	constructor(
		@inject("IUserRepository") private userRepository: IUserRepository,
		@inject("IPasswordHasher") private passwordHasher: IPasswordHasher
	) {}

	async execute(input: CreateUserInput): Promise<CreateUserResult> {
		const existingUser = await this.userRepository.findByEmail(input.email);

		if (existingUser?.email === input.email) {
			throw new ValidationError("Email already exists");
		}

		const passwordHash = await this.passwordHasher.hashPassword(input.password);

		const user = await this.userRepository.create({
			...input,
			password: passwordHash,
		});

		return {
			success: true,
			data: user,
			message: "User created successfully",
		};
	}
}
