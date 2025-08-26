import { users, type TUser } from "../db/schema/user";
import { eq, and } from "drizzle-orm";
import type { CreateUserInput, UserResponse } from "../dto/auth.dto";
import { FastifyInstance } from "fastify";

export interface IUserRepository {
	findByEmail(email: string): Promise<TUser | null>;
	findById(id: string): Promise<TUser | null>;
	create(data: CreateUserInput): Promise<UserResponse>;
}

export class UserRepository implements IUserRepository {
	constructor(private server: FastifyInstance) {}
	async findByEmail(email: string): Promise<TUser | null> {
		const result = await this.server.db
			.select()
			.from(users)
			.where(eq(users.email, email));

		return result.length > 0 ? result[0] : null;
	}
	async findById(id: string): Promise<TUser | null> {
		const result = await this.server.db
			.select()
			.from(users)
			.where(eq(users.id, id));
		return result.length > 0 ? result[0] : null;
	}
	async create(data: CreateUserInput): Promise<UserResponse> {
		const result = await this.server.db.insert(users).values(data).returning();

		const userWithoutPassword = {
			id: result[0].id,
			email: result[0].email,
			firstName: result[0].firstName,
			lastName: result[0].lastName,
			role: result[0].role,
			isActive: result[0].isActive,
			createdAt: result[0].createdAt,
			updatedAt: result[0].updatedAt,
		};

		return userWithoutPassword;
	}
}
