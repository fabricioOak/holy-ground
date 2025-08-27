import { FastifyInstance } from "fastify";
import { ITokenService } from "../../../interfaces/tokenService";

export class FastifyTokenService implements ITokenService {
	constructor(private jwt: FastifyInstance["jwt"]) {}
	async generate(payload: any): Promise<string> {
		return this.jwt.sign(payload, {
			expiresIn: process.env.JWT_EXPIRES_IN! ?? "24h",
		});
	}
	async verify(token: string): Promise<any> {
		try {
			return await this.jwt.verify(token);
		} catch (error) {
			throw new Error("Token inválido ou expirado");
		}
	}
}
