// handles login routing
import { Router } from "express";
import loginController from "../controllers/login.controller";
import passport from "passport";

const loginRoutes = Router();

// 'GET /login' -- TODO

/**
 * @swagger
 * /login:
 *   get:
 *     summary: Get Login page
 *     tags: [Login]
 *     description: This endpoint renders the login page.
 *     responses:
 *       '200':
 *         description: Página de inicio de sesión renderizada correctamente
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 */
loginRoutes.get("/", loginController.getLoginPage);

// 'POST /login'

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Login User
 *     tags: [Login]
 *     description: This endpoint authorizes the user to the app.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user:
 *                 type: object
 *                 required:
 *                   - email
 *                   - password
 *                 properties:
 *                   email:
 *                     type: string
 *                     format: email
 *                   password:
 *                     type: string
 *                     format: password
 *     responses:
 *       '200':
 *         description: Usuario autenticado con éxito, cookie de autorización enviada.
 *       '400':
 *         description: Petición incorrecta, falta email o contraseña.
 *       '404':
 *         description: Usuario no encontrado o contraseña incorrecta.
 */
loginRoutes.post("/", loginController.loginUser);

// 'POST /login/google'
loginRoutes.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile"],
  }),
);

export default loginRoutes;
