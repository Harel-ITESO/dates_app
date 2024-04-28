import { Request, Response } from 'express';

export const displayPaymentPage = (_req: Request, res: Response) => {
  res.render('payment', {
    title: 'Pago Premium',
    message: 'Completa el pago para activar tu cuenta Premium.'
  });
};