// Convert JSON keys to TypeScript enums
export enum UserPermissions {
  "CREATE_USER"= "create_user",
  "EDIT_USER"= "edit_user",
  "DELETE_USER"= "delete_user",
  "DELETE_USER_PERMANENTLY"= "delete_user_permanently",
}

export enum PasswordPermissions {
  "CREATE_PASSWORD"= "create_password",
  "EDIT_PASSWORD"= "edit_password",
  "DELETE_PASSWORD"= "delete_password",
  "DELETE_PASSWORD_PERMANENTLY"= "delete_password_permanently",
}

export enum RolePermissions {
  "CREATE_ROLE"= "create_role",
  "EDIT_ROLE"= "edit_role",
  "DELETE_ROLE"= "delete_role",
  "DELETE_ROLE_PERMANENTLY"= "delete_role_permanently",
}

// Optionally, combine all permissions into a single object or array
export const AllPermissions = {
  ...UserPermissions,
  ...PasswordPermissions,
  ...RolePermissions
};
