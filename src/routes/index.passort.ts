import { Router } from 'express';
import passport from 'passport';
import { UserRequest } from '../types/global';

const router = Router();

router.get('/', (req, res) => {
    res.send(`<h1>Bienvenido, ${req.user ? (req.user as UserRequest) : 'Invitado'}!</h1>`);
});

router.get('/login', (req, res) => {
    res.send('<a href="/google">Iniciar sesion con Google</a>');
})

router.get('/google', passport.authenticate('google', { 
    scope: ['profile', 'email'] 
}));

router.get('/callback',
    passport.authenticate('google', { 
        failureRedirect: '/login' 
    }),
    (req, res) => {
      res.redirect('/'); // Enviar a home
    }
);


export default router;