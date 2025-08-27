import { FastifyRequest, FastifyReply } from "fastify";
import { EUserRoles } from "../../shared/enums/user.enum";

export const createRoleGuard = (allowedRoles: EUserRoles[]) => {
	return async (request: FastifyRequest, reply: FastifyReply) => {
		if (!request.user) {
			return reply.code(403).send({ message: "Acesso negado." });
		}

		const hasAccess = allowedRoles.includes(request.user.role);

		if (!hasAccess) {
			return reply
				.code(403)
				.send({ message: "Seu papel não permite esta ação." });
		}
	};
};
