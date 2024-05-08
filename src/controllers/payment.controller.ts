import { Request, Response } from "express";

class PaymentController {
  getPaymentPage(req: Request, res: Response) {
    const { password, ...user } = req.user!;
    if (user.hasSuscription) {
      res.redirect("/");
    }
    res.render("payment", {
      layout: false,
      user,
      subtitle: "Payment",
      scripts: ["/public/js/payment.js"],
    });
  }
}

export default new PaymentController();
