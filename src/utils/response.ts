import { FailItemResponse } from "../common/interfaces/fail-item-response.interface";

export const buildFailItemResponse = ( 
	code: string | number,
	message: string,
	dto: any = null
): FailItemResponse  => {
	const attributes = { ...dto };
	if (!!dto && !!dto.object_uid && typeof dto.object_uid === 'object') {
		try {
			attributes.object_uid = dto.object_uid.getPlain();
		} catch {
			attributes.object_uid = dto.object_uid;
		}
	}
	return {
		code,
		message,
		attributes
	};
};