// Convert JSON keys to TypeScript enums
export enum UserPermissions {
  "READ_ALL_USER"= "read_all_user",
  "READ_USER"= "read_user",
  "CREATE_USER"= "create_user",
  "EDIT_USER"= "edit_user",
  "DELETE_USER"= "delete_user"
}

export enum PostPermissions {
  "CREATE_POST"= "create_post",
  "EDIT_POST"= "edit_post",
  "DELETE_POST"= "delete_post"
}

// Optionally, combine all permissions into a single object or array
export const AllPermissions = {
  ...UserPermissions,
  ...PostPermissions
};
