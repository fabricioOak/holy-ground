import * as argon2 from "argon2";
import { IPasswordHasher } from "../../shared/interfaces/passwordHasher";

export class Argon2PasswordHasher implements IPasswordHasher {
	async hashPassword(password: string): Promise<string> {
		return await argon2.hash(password, {
			type: argon2.argon2id,
			memoryCost: 2 ** 16, // 64MB
			timeCost: 3,
			parallelism: 1,
		});
	}
	async comparePassword(password: string, hash: string): Promise<boolean> {
		return await argon2.verify(hash, password);
	}
}
