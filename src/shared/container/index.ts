import "reflect-metadata";
import { container, instanceCachingFactory } from "tsyringe";
import { FastifyInstance } from "fastify";

import { UserRepository } from "../../modules/users/users.repository";
import { Argon2PasswordHasher } from "../utils/argon2";
import { FastifyTokenService } from "../infra/http/security/fastifyTokenService";

container.register("IPasswordHasher", {
	useClass: Argon2PasswordHasher,
});
container.register("IUserRepository", {
	useFactory: instanceCachingFactory((c) => c.resolve(UserRepository)),
});
container.register("ITokenService", {
	useFactory: instanceCachingFactory(
		(c) =>
			new FastifyTokenService(c.resolve<FastifyInstance>("FastifyInstance").jwt)
	),
});

export { container };
