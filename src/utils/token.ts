// jwt utils

import jwt from "jsonwebtoken";

const secretKey = process.env["SECRET_KEY"] || "";

let expiration = "";

if (process.env.NODE_ENV === "Development") {
  expiration = "10m";
}

if (process.env.NODE_ENV === "Production") {
  expiration = "3m";
}

export function generateToken(email: string, userId: string) {
  return jwt.sign({ email, userId }, secretKey, { expiresIn: expiration });
}

export function decodeToken(token: string) {
  return jwt.verify(token, secretKey) as jwt.JwtPayload;
}
