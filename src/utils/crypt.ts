// password encrypt utils

import bcrypt from "bcryptjs";

export function hashPassword(password: string) {
  return bcrypt.hashSync(password, 10);
}

export function comparePassword(source: string, target: string) {
  return bcrypt.compareSync(source, target);
}
