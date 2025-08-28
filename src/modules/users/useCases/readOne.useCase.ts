import { DefaultApiResult } from "../../../shared/interfaces/defaultApiResult";
import { ValidationError } from "../../../shared/utils/validationError";
import { UserResponse } from "../user.dto";
import { IUserRepository } from "../users.repository";
import { inject, injectable } from "tsyringe";

export interface ReadOneUsersResult extends DefaultApiResult {
	data?: UserResponse;
}

@injectable()
export class ReadOneUserUseCase {
	constructor(
		@inject("IUserRepository") private userRepository: IUserRepository
	) {}

	async execute(id: string): Promise<ReadOneUsersResult | null> {
		if (id.length <= 0) {
			throw new ValidationError("Id is required");
		}
		const user = await this.userRepository.findById(id);

		if (!user) {
			throw new ValidationError("User not found");
		}

		return {
			success: true,
			data: user,
			message: "User retrieved successfully",
		};
	}
}
