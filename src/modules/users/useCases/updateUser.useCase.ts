import { IUserRepository } from "../users.repository";
import { UpdateUserInput, UserResponse } from "../user.dto";
import { inject, injectable } from "tsyringe";

export interface UpdateUserResult {
	success: boolean;
	data?: UserResponse;
	message: string;
}

@injectable()
export class UpdateUserUseCase {
	constructor(
		@inject("IUserRepository") private userRepository: IUserRepository
	) {}

	async execute(id: string, data: UpdateUserInput): Promise<UpdateUserResult> {
		try {
			if (!id) {
				return {
					success: false,
					message: "User id is required",
				};
			}

			const updatedUser = await this.userRepository.update(id, data);

			if (!updatedUser || !updatedUser.id) {
				return {
					success: false,
					message: "User not found",
				};
			}

			return {
				success: true,
				data: updatedUser,
				message: "User updated successfully",
			};
		} catch (error) {
			return {
				success: false,
				message: "User update failed",
			};
		}
	}
}
