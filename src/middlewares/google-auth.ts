import { PrismaClient } from '@prisma/client';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import session from 'express-session';
import { Application } from 'express';

const prisma = new PrismaClient();

export const googleAuth = (app: Application) => {
    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_ID!,
        clientSecret: process.env.GOOGLE_SECRET!,
        callbackURL: process.env.GOOGLE_CALLBACK_URL
    }, async (accessToken, refreshToken, profile, cb) => {
        try {
            const email = profile.emails?.[0]?.value;
            if (!email) {
                return cb(new Error("No email associated with Google account."), undefined);
            }

            const user = await prisma.user.upsert({
                where: { email: email },
                create: {
                    email: email,
                    username: profile.displayName || email,
                    password: '',
                    profilePic: profile.photos?.[0]?.value || null,
                    hasSuscription: false,
                    isNew: true,
                    interestsIds: []
                },
                update: {}
            });
            cb(null, user);
        } catch (error) {
            // Aquí se asegura que el error es del tipo correcto
            if (error instanceof Error) {
                cb(error, undefined);
            } else {
                cb(new Error('An unknown error occurred'), undefined);
            }
        }
    }));

    passport.serializeUser((user: any, cb) => {
        cb(null, user.userId);
    });

    passport.deserializeUser(async (userId: string, cb) => {
        try {
            const user = await prisma.user.findUnique({
                where: { userId }
            });
            if (!user) {
                return cb(new Error("User not found"), undefined);
            }
            cb(null, user);
        } catch (error) {
            if (error instanceof Error) {
                cb(error, undefined);
            } else {
                cb(new Error('An unknown error occurred'), undefined);
            }
        }
    });

    app.use(session({
        resave: false,
        saveUninitialized: true,
        secret: process.env.SECRET_KEY!
    }));

    app.use(passport.initialize());
    app.use(passport.session());
}
