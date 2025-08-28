import { users, type TUser } from "../../shared/infra/db/schema/user";
import { eq, and, count, ilike, or } from "drizzle-orm";
import {
	CreateUserInput,
	UserResponse,
	UpdateUserInput,
	ReadListUsersQuery,
} from "../users/user.dto";
import { DbConnection } from "../../shared/infra/db/index";
import { inject, injectable } from "tsyringe";

export interface IUserRepository {
	findByEmail(email: string): Promise<TUser | null>;
	findById(id: string): Promise<TUser | null>;
	create(data: CreateUserInput): Promise<UserResponse>;
	update(id: string, data: UpdateUserInput): Promise<UserResponse>;
	delete(id: string): Promise<boolean>;
	findMany(query: ReadListUsersQuery): Promise<{
		users: UserResponse[];
		total: number;
	}>;
	updatePassword(id: string, password: string): Promise<boolean>;
}

@injectable()
export class UserRepository implements IUserRepository {
	constructor(@inject("DbConnection") private db: DbConnection) {}
	async findByEmail(email: string): Promise<TUser | null> {
		const result = await this.db
			.select()
			.from(users)
			.where(eq(users.email, email));

		return result.length > 0 ? result[0] : null;
	}
	async findById(id: string): Promise<TUser | null> {
		const result = await this.db.select().from(users).where(eq(users.id, id));
		return result.length > 0 ? result[0] : null;
	}
	async create(data: CreateUserInput): Promise<UserResponse> {
		const result = await this.db.insert(users).values(data).returning();

		return this.mapToResponse(result[0]);
	}

	async update(id: string, data: UpdateUserInput): Promise<UserResponse> {
		const result = await this.db
			.update(users)
			.set({
				...data,
				updatedAt: new Date(),
			})
			.where(eq(users.id, id))
			.returning();

		return this.mapToResponse(result[0]);
	}
	async delete(id: string): Promise<boolean> {
		//! Soft delete
		const result = await this.db
			.update(users)
			.set({
				isActive: false,
				updatedAt: new Date(),
			})
			.where(eq(users.id, id))
			.returning();

		return result.length > 0;
	}
	async findMany(query: ReadListUsersQuery): Promise<{
		users: UserResponse[];
		total: number;
	}> {
		const { page = 1, limit = 20, search, role } = query;
		const offset = (page - 1) * limit;

		const filters = [];

		if (search) {
			filters.push(
				or(
					ilike(users.firstName, `%${search}%`),
					ilike(users.lastName, `%${search}%`),
					ilike(users.email, `%${search}%`)
				)
			);
		}

		if (role) {
			filters.push(eq(users.role, role as any));
		}

		if (typeof query.isActive === "boolean") {
			filters.push(eq(users.isActive, query.isActive));
		}

		const where = filters.length > 0 ? and(...filters) : undefined;

		const [data, totalResult] = await Promise.all([
			this.db
				.select()
				.from(users)
				.where(where)
				.limit(limit)
				.offset(offset)
				.orderBy(users.createdAt),

			this.db.select({ count: count() }).from(users).where(where),
		]);

		return {
			users: data.map((user) => this.mapToResponse(user)),
			total: totalResult[0].count,
		};
	}
	async updatePassword(id: string, password: string): Promise<boolean> {
		const result = await this.db
			.update(users)
			.set({
				password,
				updatedAt: new Date(),
			})
			.where(eq(users.id, id))
			.returning();

		return result.length > 0;
	}

	private mapToResponse(user: TUser): UserResponse {
		return {
			id: user.id,
			email: user.email,
			firstName: user.firstName,
			lastName: user.lastName,
			role: user.role,
			isActive: user.isActive,
			createdAt: user.createdAt.toISOString(),
			updatedAt: user.updatedAt.toISOString(),
		};
	}
}
