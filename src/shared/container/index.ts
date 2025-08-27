import { FastifyInstance } from "fastify";
import {
	AuthContainer,
	type AuthDependencies,
} from "../../modules/auth/auth.container";
import {
	UserContainer,
	type UserDependencies,
} from "../../modules/users/users.container";
import { Argon2PasswordHasher } from "../utils/argon2";

export interface AppDependencies {
	auth: AuthDependencies;
	users: UserDependencies;
}

export class MainContainer {
	private static instance: MainContainer;
	public readonly modules: AppDependencies;

	private constructor(private server: FastifyInstance) {
		const passwordHasher = new Argon2PasswordHasher();

		const authContainer = new AuthContainer(
			this.server,
			this.server.db,
			passwordHasher
		);
		const userContainer = new UserContainer(this.server.db, passwordHasher);

		this.modules = {
			auth: authContainer.dependencies,
			users: userContainer.dependencies,
		};
	}

	static getInstance(server: FastifyInstance): MainContainer {
		if (!MainContainer.instance) {
			MainContainer.instance = new MainContainer(server);
		}
		return MainContainer.instance;
	}
}
