// jwt utils

import jwt from "jsonwebtoken";

const secretKey = process.env["SECRET_KEY"] || "";

let expiration = "";
let hasExpiration = false;

if (process.env.NODE_ENV === "Production") {
  hasExpiration = true;
  expiration = "10m";
}

export function generateToken(email: string, userId: string) {
  return jwt.sign(
    { email, userId },
    secretKey,
    hasExpiration ? { expiresIn: expiration } : {},
  );
}

export function decodeToken(token: string) {
  return jwt.verify(token, secretKey) as jwt.JwtPayload;
}
