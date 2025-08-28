import { FastifyRequest, FastifyReply } from "fastify";
import { EUserRoles } from "../../shared/enums/user.enum";

interface AuthorizeOptions {
	allowed?: EUserRoles[];
	denied?: EUserRoles[];
}

export const authorize = (options: AuthorizeOptions) => {
	return async (request: FastifyRequest, reply: FastifyReply) => {
		if (!request.user) {
			return reply.code(403).send({
				success: false,
				message: "Access denied: user not authenticated.",
			});
		}
		const userRole = request.user.role;
		if (options.allowed && !options.allowed.includes(userRole)) {
			return reply.code(403).send({
				success: false,
				message: "You have no privilege to access this route.",
			});
		}

		if (options.denied && options.denied.includes(userRole)) {
			return reply.code(403).send({
				success: false,
				message: "You have no privilege to access this route.",
			});
		}
	};
};
