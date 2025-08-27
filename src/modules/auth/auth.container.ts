import { FastifyInstance } from "fastify";
import { UserRepository } from "../users/users.repository";
import { AuthController } from "./auth.controller";

import { FastifyTokenService } from "../../shared/infra/http/security/fastifyTokenService";
import { Argon2PasswordHasher } from "../../shared/utils/argon2";

import { LoginUseCase } from "../auth/useCases/login.useCase";
import { LogoutUseCase } from "../auth/useCases/logout.useCase";
import { DbConnection } from "../../shared/infra/db";
import { IPasswordHasher } from "../../shared/interfaces/passwordHasher";

export interface AuthDependencies {
	userRepository: UserRepository;
	authController: AuthController;

	// Services
	tokenService: FastifyTokenService;
	passwordHasher: Argon2PasswordHasher;

	// Use Cases
	loginUseCase: LoginUseCase;
	logoutUseCase: LogoutUseCase;
}

export class AuthContainer {
	public readonly dependencies: AuthDependencies;

	constructor(
		private server: FastifyInstance,
		private db: DbConnection,
		private passwordHasher: IPasswordHasher
	) {
		// Repositories
		const userRepository = new UserRepository(this.db);

		// Services
		const tokenService = new FastifyTokenService(this.server.jwt);

		// Use Cases
		const loginUseCase = new LoginUseCase(
			userRepository,
			this.passwordHasher,
			tokenService
		);
		const logoutUseCase = new LogoutUseCase();

		// Controllers
		const authController = new AuthController(loginUseCase, logoutUseCase);

		this.dependencies = {
			userRepository,
			authController,

			tokenService,
			passwordHasher: this.passwordHasher,

			loginUseCase,
			logoutUseCase,
		};
	}
}
