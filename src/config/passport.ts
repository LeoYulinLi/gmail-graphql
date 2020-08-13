import passport from "passport";
import { OAuth2Strategy } from "passport-google-oauth";
import keys from "./keys";
import User from "../models/User";

export default function configPassport(passport: passport.PassportStatic) {
  passport.use(
    new OAuth2Strategy({
      clientID: keys.googleClientId,
      clientSecret: keys.googleClientSecret,
      callbackURL: keys.googleAppCallback
    }, async (accessToken, refreshToken, profile, done) => {
      const user = await User.findOne({ googleId: profile.id });
      if (user) {
        done(null, user);
      } else {
        const newUser = new User({
          googleId: profile.id
        });
        await newUser.save();
        done(null, newUser);
      }
    })
  );

  passport.serializeUser((user: any, done) => {
    done(null, user.id);
  })

  passport.deserializeUser(async (id: string, done) => {
    done(null, await User.findById(id));
  })

}
