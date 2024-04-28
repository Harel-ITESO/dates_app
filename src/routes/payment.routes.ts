// routes/premiumRoutes.ts
import { Router } from 'express';
import { displayPaymentPage } from '../controllers/payment.controller';

const router = Router();

// Mostrar la página de pago
router.get('/', displayPaymentPage);

export default router;