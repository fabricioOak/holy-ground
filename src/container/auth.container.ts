import { FastifyInstance } from "fastify";
import { UserRepository } from "../repositories/user.repository";
import { AuthService } from "../services/auth.service";
import { AuthController } from "../controllers/auth.controller";

import { LoginUseCase } from "../useCases/auth/login.useCase";
import { LogoutUseCase } from "../useCases/auth/logout.useCase";

export interface AuthDependencies {
	authService: AuthService;
	userRepository: UserRepository;
	authController: AuthController;

	// Use Cases
	loginUseCase: LoginUseCase;
	logoutUseCase: LogoutUseCase;
}

export class AuthContainer {
	public readonly dependencies: AuthDependencies;

	constructor(private server: FastifyInstance) {
		// Repositories
		const userRepository = new UserRepository(this.server);

		// Services
		const authService = new AuthService(this.server);

		// Use Cases
		const loginUseCase = new LoginUseCase(userRepository, authService);
		const logoutUseCase = new LogoutUseCase();

		// Controllers
		const authController = new AuthController(loginUseCase, logoutUseCase);

		this.dependencies = {
			userRepository,
			authService,
			authController,

			loginUseCase,
			logoutUseCase,
		};
	}
}
