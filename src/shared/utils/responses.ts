import { Type, type TSchema } from "@sinclair/typebox";

const NullableData = Type.Null();

export function ApiResponse<T extends TSchema>(dataSchema: T | null) {
	return Type.Object({
		success: Type.Boolean({ default: true }),
		message: Type.String(),
		data: dataSchema ? dataSchema : NullableData,
	});
}

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
