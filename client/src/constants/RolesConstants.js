import Shared from "../utils/Shared";

export const ROLES = {
  1: "User",
  2: "Superuser",
  3: "Admin",
};

export const rolesDesc = {
  onlyAdmin: [Shared.Roles.admin],
  onlySuper: [Shared.Roles.super],
  onlyUser: [Shared.Roles.user],
  admin_super: [Shared.Roles.admin, Shared.Roles.super],
  admin_user: [Shared.Roles.admin, Shared.Roles.user],
  super_user: [Shared.Roles.super, Shared.Roles.user],
  allOf: [Shared.Roles.admin, Shared.Roles.super, Shared.Roles.user],
};
