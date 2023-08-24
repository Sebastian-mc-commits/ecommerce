import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as GithuStrategy } from "passport-github2";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import * as userService from "../services/user.service.js";
import authMessages from "./messages/messages.auth.utils.js";
import config from "../config/config.js";
import passportEnum from "./enums/passport.enum.js";
import ErrorHandler from "./classes/errorHandler.utils.js";
import errorCodes from "./enums/errorCodes.enum.js";
import customErrorCodes from "./enums/errorCodes.custom.enum.js";

const {
  CLIENT_SECRET,
  CLIENT_ID,
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  FRONT_END_VIEWS
} = config;

passport.serializeUser(function ({ _id }, done) {
  done(null, _id);
});

passport.deserializeUser(async function (_id, done) {
  try {
    const user = await userService.getUserById(_id);

    return done(null, user);
  } catch {
    done(null, false);
  }
});

passport.use(
  "signup",
  new LocalStrategy({ passReqToCallback: true, usernameField: "email" }, singup)
);

async function singup(req, username, password, done) {
  try {
    const { name, last_name } = req.body;

    const user = await userService.createUser({
      name,
      last_name,
      auth: {
        email: username,
        password
      }
    });

    return done(null, user);
  } catch (error) {
    return done(error, false);
  }
}

passport.use(
  "login",
  new LocalStrategy({ usernameField: "email", passReqToCallback: true }, login)
);

async function login(req, username, password, done) {
  try {
    const user = await userService.getUser({
      auth: {
        email: username,
        password
      }
    });

    return done(null, user);
  } catch (error) {
    return done(error, false);
  }
}
passport.use(
  "github",
  new GithuStrategy(
    {
      clientID: CLIENT_ID,
      clientSecret: CLIENT_SECRET,
      callbackURL: "http://localhost:4000/api/auth/github/callback",
      scope: ["user:email"],
      passReqToCallback: true
    },
    github
  )
);

async function github(req, accessToken, refreshToken, profile, done) {
  const { displayName, emails, provider, username, _json } = profile;
  const completeName = displayName?.split(" ");

  const credentials = {
    name: completeName ? completeName[0] : username,
    last_name: completeName ? completeName[1] : "",
    image: _json.avatar_url,
    auth: {
      email: emails[0].value,
      provider
    }
  };

  try {
    const user = await userService.getUserOrCreateOne(credentials);

    return done(null, user);
  } catch ({ message }) {
    return done(
      new ErrorHandler(
        message,
        "",
        errorCodes.FORBIDDEN,
        customErrorCodes.SPECIFIED_REDIRECT(FRONT_END_VIEWS.AUTH_PAGE)
      ),
      null,
      false
    );
  }
}

passport.use(
  "google",
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:4000/api/auth/google/redirect",
      passReqToCallback: true
    },
    google
  )
);

async function google(req, accessToken, refreshToken, profile, done) {
  const { displayName, _json, provider } = profile;

  const completeName = displayName?.split(" ");

  if (!_json?.email_verified) {
    return done(
      new ErrorHandler(
        authMessages.EMAIL_VERIFICATION_REQUIRED,
        "",
        errorCodes.FORBIDDEN,
        customErrorCodes.SPECIFIED_REDIRECT(FRONT_END_VIEWS.AUTH_PAGE)
      ),
      null,
      false
    );
  }

  const credentials = {
    name: completeName ? completeName[0] : _json.email,
    last_name: completeName ? completeName[1] : "",
    image: _json.picture,
    auth: {
      email: _json.email,
      provider
    }
  };
  try {
    const user = await userService.getUserOrCreateOne(credentials);

    return done(null, user);
  } catch ({ message }) {
    return done(
      new ErrorHandler(
        message,
        "",
        errorCodes.FORBIDDEN,
        customErrorCodes.SPECIFIED_REDIRECT(FRONT_END_VIEWS.AUTH_PAGE)
      ),
      null,
      false
    );
  }
}
export default passport;
