// handles routing for every http request on '/users'
import { Router } from "express";
import userController from "../controllers/user.controller";

const userRoutes = Router();

// 'GET /users'

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get list of users
 *     tags: [Users]
 *     description: Fetches a list of all users from the database. Returns an array of user objects.
 *     responses:
 *       '200':
 *         description: A JSON array of user objects
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     description: The user ID
 *                   name:
 *                     type: string
 *                     description: The user's name
 *                   email:
 *                     type: string
 *                     description: The user's email
 *               example:
 *                 - id: "123"
 *                   name: "John Doe"
 *                   email: "john.doe@example.com"
 *       '500':
 *         description: Server error
 */
userRoutes.get("/", userController.getUsers);

// file routes

export default userRoutes;
