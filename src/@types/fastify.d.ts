import type { JWT } from "@fastify/jwt";
import { EUserRoles } from "../common/enums/user.enum";
import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { schemas } from "../db/schema";
import { MainContainer } from "../container";

declare module "fastify" {
	interface FastifyRequest {
		jwt: JWT;
		user: UserPayload;
	}

	interface FastifyInstance {
		authenticate: (req: FastifyRequest, reply: FastifyReply) => Promise<void>;
		db: NodePgDatabase<typeof schemas>;
		container: MainContainer;
	}
}

type UserPayload = {
	id: string;
	email: string;
	name: string;
	role: EUserRoles;
	isVerified: boolean;
};

declare module "@fastify/jwt" {
	interface FastifyJWT {
		user: UserPayload;
	}
}
