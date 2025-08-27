import { UserRepository } from "./users.repository";
import { Argon2PasswordHasher } from "../../shared/utils/argon2";
import { CreateUserUseCase } from "./useCases/createUser.useCase";
import { UserController } from "./users.controller";
import { DbConnection } from "../../shared/infra/db";
import { IPasswordHasher } from "../../shared/interfaces/passwordHasher";

export interface UserDependencies {
	userRepository: UserRepository;
	passwordHasher: Argon2PasswordHasher;
	userController: UserController;
	createUserUseCase: CreateUserUseCase;
}

export class UserContainer {
	public readonly dependencies: UserDependencies;

	constructor(
		private db: DbConnection,
		private passwordHasher: IPasswordHasher
	) {
		// Repositories
		const userRepository = new UserRepository(this.db);

		// Use Cases
		const createUserUseCase = new CreateUserUseCase(
			userRepository,
			this.passwordHasher
		);

		const userController = new UserController(createUserUseCase);

		this.dependencies = {
			userRepository,
			userController,
			passwordHasher,

			createUserUseCase,
		};
	}
}
