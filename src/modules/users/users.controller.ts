import { FastifyRequest, FastifyReply } from "fastify";
import { CreateUserUseCase } from "../useCases/users/createUser.useCase";
import { CreateUserInput } from "../dto/user.dto";

export class UserController {
	constructor(private createUserUseCase: CreateUserUseCase) {}

	async create(
		request: FastifyRequest<{
			Body: CreateUserInput;
		}>,
		reply: FastifyReply
	) {
		try {
			const result = await this.createUserUseCase.execute(request.body);

			if (!result.success) {
				return reply.status(400).send({
					success: result.success,
					data: result.data || null,
					message: result.message,
				});
			}

			return reply.status(201).send({
				success: result.success,
				data: result.data || null,
				message: result.message,
			});
		} catch (error) {
			request.log.error(error);
			return reply.status(500).send({
				success: false,
				message: "Internal server error",
				data: null,
			});
		}
	}
}
