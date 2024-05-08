import { Router } from "express";
import paymentController from "../controllers/payment.controller";

const paymentRoutes = Router();

paymentRoutes.get("/page", paymentController.getPaymentPage);

export default paymentRoutes;
