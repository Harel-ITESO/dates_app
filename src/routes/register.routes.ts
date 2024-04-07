// handles register routing
import { Router } from "express";
import registerController from "../controllers/register.controller";

const registerRoutes = Router();

// 'GET /register' -- TODO

/**
 * @swagger
 * /register:
 *   get:
 *     summary: Get Register Page
 *     tags: [Registration]
 *     description: Renders the registration page for new users.
 *     responses:
 *       '200':
 *         description: Registration page rendered successfully.
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 *               description: HTML content of the register page.
 */
registerRoutes.get("/", registerController.getRegisterPage);

// 'POST /register'

/**
 * @swagger
 * /register:
 *   post:
 *     summary: Register a new user
 *     tags: [Registration]
 *     description: Creates a new user account with the provided email, username, and password.
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
 *                   - username
 *                   - password
 *                 properties:
 *                   email:
 *                     type: string
 *                     format: email
 *                     description: User's email address.
 *                   username:
 *                     type: string
 *                     description: Chosen username for the user.
 *                   password:
 *                     type: string
 *                     format: password
 *                     description: Password for the user account.
 *             example:
 *               user:
 *                 email: "jane.doe@example.com"
 *                 username: "janedoe"
 *                 password: "password123"
 *     responses:
 *       '201':
 *         description: User created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User created with id: 12345"
 *       '400':
 *         description: Missing fields or bad request.
 */
registerRoutes.post("/", registerController.registerUser);

export default registerRoutes;
