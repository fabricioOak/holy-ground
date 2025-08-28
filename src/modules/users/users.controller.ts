import { FastifyRequest, FastifyReply } from "fastify";
import { inject, injectable } from "tsyringe";
import { CreateUserUseCase } from "../users/useCases/createUser.useCase";
import { UpdateUserUseCase } from "./useCases/updateUser.useCase";
import { ReadListUsersUseCase } from "./useCases/readListUser.useCase";
import {
	CreateUserInput,
	UpdateUserInput,
	ReadListUsersQuery,
} from "../users/user.dto";

@injectable()
export class UserController {
	constructor(
		@inject(CreateUserUseCase) private createUserUseCase: CreateUserUseCase,
		@inject(UpdateUserUseCase) private updateUserUseCase: UpdateUserUseCase,
		@inject(ReadListUsersUseCase)
		private readListUsersUseCase: ReadListUsersUseCase
	) {}

	public create = async (
		request: FastifyRequest<{
			Body: CreateUserInput;
		}>,
		reply: FastifyReply
	) => {
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
	};

	public update = async (
		request: FastifyRequest<{
			Body: UpdateUserInput;
			Params: { id: string };
		}>,
		reply: FastifyReply
	) => {
		try {
			const { id } = request.params;
			const result = await this.updateUserUseCase.execute(id, request.body);

			if (!result.success) {
				return reply.status(400).send({
					success: result.success,
					data: result.data || null,
					message: result.message,
				});
			}

			return reply.status(200).send({
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
	};

	public readlist = async (
		request: FastifyRequest<{
			Querystring: ReadListUsersQuery;
		}>,
		reply: FastifyReply
	) => {
		try {
			const { isActive, limit, page, role, search } = request.query;

			const result = await this.readListUsersUseCase.execute({
				isActive,
				limit,
				page,
				role,
				search,
			});

			console.log("result", result);

			if (!result.success) {
				return reply.status(400).send({
					success: result.success,
					data: result.data || null,
					message: result.message,
				});
			}

			return reply.status(200).send({
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
	};
}
