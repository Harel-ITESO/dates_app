import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";

const clientID = process.env["GOOGLE_CLIENT_ID"] || "";
const clientSecret = process.env["GOOGLE_CLIENT_SECRET"] || "";
const callbackURL = "/home";

passport.use(
  new GoogleStrategy({ clientID, clientSecret, callbackURL }, () => { }),
);
