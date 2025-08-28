import { IUserRepository } from "../users.repository";
import { ReadListUsersQuery, UserResponse } from "../user.dto";
import { inject, injectable } from "tsyringe";
import { ValidationError } from "../../../shared/utils/validationError";

export interface ReadListUsersResult {
	success: boolean;
	data?: {
		items: UserResponse[];
		pagination: {
			page: number;
			limit: number;
			total: number;
			totalPages: number;
			hasNext: boolean;
			hasPrev: boolean;
		};
	};
	message: string;
}

@injectable()
export class ReadListUsersUseCase {
	constructor(
		@inject("IUserRepository") private readonly userRepository: IUserRepository
	) {}

	async execute(query: ReadListUsersQuery): Promise<ReadListUsersResult> {
		try {
			const { total, users } = await this.userRepository.findMany(query);
			const { page = 1, limit = 20 } = query;

			const totalPages = Math.ceil(total / limit);

			return {
				success: true,
				data: {
					items: users,
					pagination: {
						page,
						limit,
						total,
						totalPages,
						hasNext: page < totalPages,
						hasPrev: page > 1,
					},
				},
				message: "Users fetched successfully",
			};
		} catch (error) {
			throw new ValidationError("Failed to fetch users");
		}
	}
}
