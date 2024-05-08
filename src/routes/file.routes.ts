import { Router } from "express";
import fileController from "../controllers/file.controller";
import upload from "../middlewares/upload.middleware";

const fileRoutes = Router();

/**
 * @swagger
 * /upload/profile-pic:
 *   post:
 *     summary: Upload user profile picture
 *     tags: [Files]
 *     description: Allows users to upload their profile picture. The location of the uploaded file should be provided in the request headers.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: header
 *         name: fileLocation
 *         required: true
 *         schema:
 *           type: string
 *         description: The location of the uploaded file on the server.
 *     responses:
 *       '202':
 *         description: Profile picture uploaded successfully. The user's profile is updated with the new profile picture URL.
 *       '400':
 *         description: Bad request. Missing file location.
 *       '401':
 *         description: Unauthorized. The user is not logged in.
 *       '500':
 *         description: Internal server error.
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: The profile picture file to upload.
 *     securitySchemes:
 *       bearerAuth:
 *         type: http
 *         scheme: bearer
 *         bearerFormat: JWT
 */
fileRoutes.post(
  "/upload/profile-pic",
  upload.single("profile_pic"),
  fileController.uploadProfilePic,
);

export default fileRoutes;
