import * as argon2 from "argon2";
import { getRolePermissions } from "../common/utils/permissions.util";
import { EUserRoles } from "../common/enums/user.enum";
import { FastifyInstance } from "fastify";

export interface IAuthService {
	hashPassword(password: string): Promise<string>;
	comparePassword(password: string, hash: string): Promise<boolean>;
	generateToken(payload: any): Promise<string>;
	verifyToken(token: string): Promise<any>;
	getRolePermissions(userRole: EUserRoles): string[];
}

export class AuthService implements IAuthService {
	constructor(private server: FastifyInstance) {}
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
	async generateToken(payload: any): Promise<string> {
		return this.server.jwt.sign(payload, {
			expiresIn: process.env.JWT_EXPIRES_IN! ?? "24h",
		});
	}
	async verifyToken(token: string): Promise<any> {
		try {
			return await this.server.jwt.verify(token);
		} catch (error) {
			throw new Error("Token inválido ou expirado");
		}
	}
	getRolePermissions(userRole: EUserRoles): string[] {
		return getRolePermissions(userRole);
	}
}
