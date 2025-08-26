import { FastifyInstance } from "fastify";
import { AuthContainer, type AuthDependencies } from "./auth.container";

export interface AppDependencies {
	auth: AuthDependencies;
}

export class MainContainer {
	private static instance: MainContainer;
	public readonly modules: AppDependencies;

	private constructor(private server: FastifyInstance) {
		const authContainer = new AuthContainer(this.server);
		this.modules = {
			auth: authContainer.dependencies,
		};
	}

	static getInstance(server: FastifyInstance): MainContainer {
		if (!MainContainer.instance) {
			MainContainer.instance = new MainContainer(server);
		}
		return MainContainer.instance;
	}
}
