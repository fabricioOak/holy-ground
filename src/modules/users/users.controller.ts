import { FastifyRequest, FastifyReply } from "fastify";
import { inject, injectable } from "tsyringe";
import { CreateUserUseCase } from "../users/useCases/createUser.useCase";
import { UpdateUserUseCase } from "./useCases/updateUser.useCase";
import { ReadListUsersUseCase } from "./useCases/readListUser.useCase";
import { ReadOneUserUseCase } from "./useCases/readOne.useCase";
import {
	CreateUserInput,
	UpdateUserInput,
	ReadListUsersQuery,
} from "../users/user.dto";
import { DeleteUserUseCase } from "./useCases/deleteUser.useCase";

@injectable()
export class UserController {
	constructor(
		@inject(CreateUserUseCase) private createUserUseCase: CreateUserUseCase,
		@inject(UpdateUserUseCase) private updateUserUseCase: UpdateUserUseCase,
		@inject(ReadListUsersUseCase)
		private readListUsersUseCase: ReadListUsersUseCase,
		@inject(DeleteUserUseCase) private deleteUserUseCase: DeleteUserUseCase,
		@inject(ReadOneUserUseCase) private readOneUserUseCase: ReadOneUserUseCase
	) {}

	public create = async (
		request: FastifyRequest<{ Body: CreateUserInput }>,
		reply: FastifyReply
	) => {
		const result = await this.createUserUseCase.execute(request.body);

		if (!result.success) {
			return reply.status(400).send(result);
		}
		return reply.status(201).send(result);
	};

	public update = async (
		request: FastifyRequest<{ Body: UpdateUserInput; Params: { id: string } }>,
		reply: FastifyReply
	) => {
		const { id } = request.params;
		const result = await this.updateUserUseCase.execute(id, request.body);

		if (!result.success) {
			return reply.status(400).send(result);
		}
		return reply.status(200).send(result);
	};

	public readlist = async (
		request: FastifyRequest<{ Querystring: ReadListUsersQuery }>,
		reply: FastifyReply
	) => {
		const result = await this.readListUsersUseCase.execute(request.query);
		return reply.status(200).send(result);
	};

	public readOne = async (
		request: FastifyRequest<{ Params: { id: string } }>,
		reply: FastifyReply
	) => {
		const { id } = request.params;

		const result = await this.readOneUserUseCase.execute(id);
		return reply.status(200).send(result);
	};

	public delete = async (
		request: FastifyRequest<{ Params: { id: string } }>,
		reply: FastifyReply
	) => {
		const { id } = request.params;
		await this.deleteUserUseCase.execute(id);

		return reply.status(200).send({
			success: true,
			message: "User deleted successfully",
			data: null,
		});
	};
}
