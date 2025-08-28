import { ValidationError } from "../../../shared/utils/validationError";
import { IUserRepository } from "../users.repository";
import { inject, injectable } from "tsyringe";

@injectable()
export class DeleteUserUseCase {
	constructor(
		@inject("IUserRepository") private readonly userRepository: IUserRepository
	) {}

	async execute(id: string) {
		if (!id) {
			throw new ValidationError("User id is required");
		}
		await this.userRepository.delete(id);

		return {
			success: false,
			message: "User deleted successfully",
		};
	}
}
