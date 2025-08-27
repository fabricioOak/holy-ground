export class LogoutUseCase {
	constructor() {}
	async execute(userId?: string) {
		try {
			if (userId) {
				return {
					success: true,
					message: "Logout success",
				};
			}
		} catch (error) {
			return {
				success: false,
				message: "Logout failed",
			};
		}
	}
}
