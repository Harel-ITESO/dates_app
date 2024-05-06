import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { userModel } from "../models/model-pool";

const clientID = process.env["GOOGLE_CLIENT_ID"] || "";
const clientSecret = process.env["GOOGLE_CLIENT_SECRET"] || "";
const callbackURL = "/login/google/callback";

passport.use(
  new GoogleStrategy(
    { clientID, clientSecret, callbackURL, passReqToCallback: true },
    async (_request, _accessToken, _refreshToken, profile, done) => {
      const json = profile._json;
      const user = await userModel.upsert({
        where: {
          email: json.email,
        },
        update: {},
        create: {
          username: json.name!,
          email: json.email!,
        },
      });
      done(null, user);
    },
  ),
);

passport.serializeUser((user, done) => {
  done(null, user.userId);
});

passport.deserializeUser(async (id, done) => {
  const user = await userModel.findFirst({
    where: {
      userId: id as number,
    },
  });
  done(null, user);
});
