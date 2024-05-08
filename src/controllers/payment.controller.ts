import { Request, Response } from 'express';
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const displayPaymentPage = (_req: Request, res: Response) => {
  res.render('payment', {
    title: 'Pago Premium',
    message: 'Completa el pago para activar tu cuenta Premium.'
  });
};

export const processPayment = async (req: Request, res: Response) => {
  if (req.user) {
    try {
      await prisma.user.update({
        where: {
          userId: req.user.userId 
        },
        data: {
          hasSuscription: true 
        }
      });
      res.redirect('/premium');
    } catch (error) {
      console.error('Error al procesar el pago:', error);
      res.status(500).send('Error al procesar el pago.');
    }
  } else {
    res.status(401).send('User not authenticated');
  }
};