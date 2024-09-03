// ================== For API ==================
export const MSG_NOT_FOUND_USER = 'Not found user';
export const MSG_DATA_INVALID = 'Data invalid';
export const INVALID_REQUEST = 'Your request is invalid.';
export const INVALID_MESSAGE_UID = 'Message uid is invalid.';
export const MSG_TOKEN_EXPIRED = "Unauthorized. Your token was expired.";
export const MSG_TOKEN_INVALID = "Unauthorized. Authorization info is undefined or the wrong format.";

// ############## error message #################
export const MSG_ERR_TOO_LONG = "Data is too long.";
export const MSG_ERR_EXISTED = "The item is existed.";
export const MSG_ERR_INVALID = "The item is invalid (or existed)";
export const MSG_ERR_NOT_EXIST = "The item does not exist";
export const MSG_ERR_DUPLICATE_ENTRY = "Duplicate entry";
export const MSG_ERR_INPUT_INVALID = 'Invalid input';
export const MSG_ERR_BAD_REQUEST = 'Bad Request';
export const MSG_ERR_NOT_FOUND = 'Not found';
export const MSG_FIND_NOT_FOUND = "The item not found";
export const MSG_INVALID_PAYLOAD_FORMAT = "Invalid payload format";

export const MSG_ERR_WHEN_CREATE = "Create failed";
export const MSG_ERR_WHEN_UPDATE = "Update failed";
export const MSG_ERR_WHEN_DELETE = "Delete failed";
export const MSG_ERR_SERVER_ERROR = "Internal server error";

export const MSG_TERMINATE_ACC_NOT_EXIST = "This account does not exist on our system";
export const PROTECT_PASSWORD_INVALID = "Protect password is invalid";
export enum MSG_ERR_HEADER {
  DEVICE_UID_LENGTH_MUST_BE_AT_LEAST_10_CHARACTERS_LONG = 'device_uid length must be at least 10 characters long',
  DEVICE_UID_LENGTH_MUST_BE_LESS_THAN_OR_EQUAL_TO_50_CHARACTERS_LONG = 'device_uid length must be less than or equal to 50 characters long',
  INVALID_DEVICE_UID = 'Invalid device_uid',
  DEVICE_UID_IS_REQUIRED = 'device_uid is required',
  APP_ID_IS_REQUIRED = 'app_id is required',
  INVALID_USER_AGENT = 'Invalid user_agent',
}