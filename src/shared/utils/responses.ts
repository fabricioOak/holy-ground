import { Type, type TSchema } from "@sinclair/typebox";

export const ApiResponse = <T extends TSchema>(
	data: T,
	opts?: { $id?: string }
) =>
	Type.Object(
		{
			success: Type.Boolean(),
			data,
			message: Type.String(),
		},
		opts?.$id ? { $id: opts.$id } : {}
	);

export const ApiPaginated = <T extends TSchema>(
	item: T,
	opts?: { $id?: string }
) =>
	Type.Object(
		{
			success: Type.Boolean(),
			data: Type.Object({
				items: Type.Array(item),
				pagination: Type.Object({
					page: Type.Number(),
					limit: Type.Number(),
					total: Type.Number(),
					totalPages: Type.Number(),
					hasNext: Type.Boolean(),
					hasPrev: Type.Boolean(),
				}),
			}),
			message: Type.String(),
		},
		opts?.$id ? { $id: opts.$id } : {}
	);
