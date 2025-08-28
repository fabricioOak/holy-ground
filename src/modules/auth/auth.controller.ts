import { FastifyRequest, FastifyReply } from "fastify";
import { LoginUseCase } from "../auth/useCases/login.useCase";
import { LogoutUseCase } from "../auth/useCases/logout.useCase";
import type { LoginInput } from "./auth.dto";
import { inject, injectable } from "tsyringe";

@injectable()
export class AuthController {
	constructor(
		@inject(LoginUseCase) private loginUseCase: LoginUseCase,
		@inject(LogoutUseCase) private logoutUseCase: LogoutUseCase
	) {}

	public login = async (
		request: FastifyRequest<{ Body: LoginInput }>,
		reply: FastifyReply
	) => {
		try {
			const result = await this.loginUseCase.execute(request.body);

			if (!result.success) {
				return reply.status(401).send(result);
			}

			reply.setCookie("access_token", result.data!.token, {
				path: "/",
				httpOnly: true,
				secure: process.env.NODE_ENV === "production",
				sameSite: "strict",
				maxAge: 24 * 60 * 60 * 1000, // 1 day
			});

			return reply.status(200).send({
				success: true,
				data: {
					user: result.data!.user,
					permissions: result.data!.permissions,
				},
				message: result.message,
			});
		} catch (error) {
			request.log.error(error);
			return reply
				.status(500)
				.send({ success: false, message: "Internal server error", data: null });
		}
	};

	public logout = async (request: FastifyRequest, reply: FastifyReply) => {
		try {
			const userId = request.user.id;

			const result = await this.logoutUseCase.execute(userId);

			reply.clearCookie("access_token", {
				path: "/",
				httpOnly: true,
				secure: process.env.NODE_ENV === "production",
			});

			return reply.status(200).send({
				success: true,
				data: null,
				message: result!.message,
			});
		} catch (error) {
			request.log.error(error);
			return reply
				.status(500)
				.send({ success: false, message: "Internal server error", data: null });
		}
	};
}
