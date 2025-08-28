import type {
	FastifyReply,
	FastifyRequest,
	RouteGenericInterface,
} from "fastify";
import type { JWT } from "@fastify/jwt";
import { EUserRoles } from "../shared/enums/user.enum";
import { schemas } from "../db/schema";
import { MainContainer } from "../shared/container/index";
import { DbConnection } from "../shared/infra/db";
import { DependencyContainer } from "tsyringe";

type UserPayload = {
	id: string;
	email: string;
	name: string;
	role: EUserRoles;
	isVerified: boolean;
};

declare module "fastify" {
	interface FastifyRequest {
		jwt: JWT;
		user?: UserPayload;
	}

	interface FastifyInstance {
		authenticate<T extends RouteGenericInterface = RouteGenericInterface>(
			req: FastifyRequest<T>,
			reply: FastifyReply
		): void | Promise<void>;
		db: DbConnection;
		container: DependencyContainer;
	}
}

declare module "@fastify/jwt" {
	interface FastifyJWT {
		user: UserPayload;
	}
}
