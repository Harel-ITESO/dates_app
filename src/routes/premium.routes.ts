import { Router } from 'express';
import premiumController from '../controllers/premium.controller';
import PremiumMatchController from '../controllers/premium_match.controller';
import matchController from '../controllers/match.controller';

const premiumRouter = Router();

// Ruta para ver usuarios que han dado like
premiumRouter.get('/', premiumController.getLikesToCurrentUser);

premiumRouter.post('/like', PremiumMatchController.handleLikeDislike);
premiumRouter.post('/dislike', PremiumMatchController.handleLikeDislike);
premiumRouter.get("/chat/:id", matchController.getMatchChatPage);

export default premiumRouter;