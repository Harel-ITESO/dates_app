// jwt utils

import jwt from "jsonwebtoken";

const secretKey = process.env["SECRET_KEY"] || "";

export function generateToken(email: string, userId: string) {
    return jwt.sign({ email, userId }, secretKey, { expiresIn: "3m" });
}

export function decodeToken(token: string) {
    return jwt.verify(token, secretKey) as jwt.JwtPayload;
}
