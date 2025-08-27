import { TUser } from "../../shared/infra/db/schema/user";
import {
	CreateUserInput,
	UserResponse,
	UpdateUserInput,
	ReadListUsersQuery,
} from "../users/user.dto";

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
