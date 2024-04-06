import { Router } from "express";
import fileController from "../controllers/file.controller";
import upload from "../middlewares/upload.middleware";

const fileRoutes = Router();

fileRoutes.post(
  "/upload/profile-pic",
  upload.single("profile_pic"),
  fileController.uploadProfilePic,
);

export default fileRoutes;
