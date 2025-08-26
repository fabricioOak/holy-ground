import { EUserRoles } from "../enums/user.enum";

//? TODO: Think a better way to handle this

export const ROLE_PERMISSIONS: Record<EUserRoles, string[]> = {
	SUPER_ADMIN: ["*"],
	CEMETERY_ADMIN: [
		"cemetery:*",
		"plots:*",
		"burials:*",
		"financial:*",
		"reports:*",
		"users:read",
	],
	OPERATOR: [
		"plots:read",
		"plots:update",
		"burials:*",
		"documents:*",
		"reports:read",
	],
	FINANCIAL: ["financial:*", "plots:read", "reports:financial"],
	VIEWER: ["plots:read", "burials:read", "reports:read"],
	PUBLIC: ["search:deceased", "maps:view"],
};

export const getRolePermissions = (role: EUserRoles): string[] => {
	return ROLE_PERMISSIONS[role] || [];
};

export const hasPermission = (
	userRole: EUserRoles,
	requiredPermission: string
): boolean => {
	const permissions = getRolePermissions(userRole);

	if (permissions.includes("*")) return true;

	return permissions.some((permission) => {
		if (permission.endsWith(":*")) {
			const baseResource = permission.replace(":*", "");
			return requiredPermission.startsWith(`${baseResource}:`);
		}
		return permission === requiredPermission;
	});
};
