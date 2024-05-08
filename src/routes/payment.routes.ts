import { Router } from 'express';
import { displayPaymentPage, processPayment } from '../controllers/payment.controller';

const router = Router();

// Mostrar la página de pago
router.get('/', displayPaymentPage);

router.post('/', processPayment);

export default router;