import { injectable } from "tsyringe";
import { ValidationError } from "../../../shared/utils/validationError";

@injectable()
export class LogoutUseCase {
	constructor() {}
	async execute(userId?: string) {
		if (!userId) {
			throw new ValidationError("User id not found");
		}
		return {
			success: true,
			message: "Logout success",
		};
	}
}
