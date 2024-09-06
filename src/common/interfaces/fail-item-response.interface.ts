export interface FailItemResponse {
  code: string | number; // Define type based on your ErrorCode usage
  message: string;
  attributes: Record<string, any>; // A generic object to accommodate any additional attributes
}