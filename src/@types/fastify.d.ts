import type {
	FastifyReply,
	FastifyRequest,
	RouteGenericInterface,
} from "fastify";
import type { JWT } from "@fastify/jwt";
import { EUserRoles } from "../common/enums/user.enum";
import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { schemas } from "../db/schema";
import { MainContainer } from "../container";

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
		db: NodePgDatabase<typeof schemas>;
		container: MainContainer;
	}
}

declare module "@fastify/jwt" {
	interface FastifyJWT {
		user: UserPayload;
	}
}
