import { IUserRepository } from "../users.model";
import { ReadListUsersQuery, UserResponse } from "../user.dto";

export interface ReadListUsersResult {
	success: boolean;
	data?: {
		users: UserResponse[];
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

export class ReadListUsersUseCase {
	constructor(private readonly userRepository: IUserRepository) {}

	async execute(query: ReadListUsersQuery): Promise<ReadListUsersResult> {
		try {
			const { total, users } = await this.userRepository.findMany(query);
			const { page = 1, limit = 20 } = query;

			const totalPages = Math.ceil(total / limit);

			return {
				success: true,
				data: {
					users,
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
			return {
				success: false,
				message: "Failed to fetch users",
			};
		}
	}
}
