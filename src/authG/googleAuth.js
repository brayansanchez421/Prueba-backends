import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth2';

passport.use(new GoogleStrategy({
    clientID:     process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3068/PE/google/callback",
    scope: ["email", "profile"],
    clientSecret:  process.env.GOOGLE_CLIENT_ID,
    callbackURL: "http://localhost:3068/PE/google/callback",
    passReqToCallback: true
  },
  function(request, accessToken, refreshToken, profile, done) {
    console.log(profile); 
    return done(null, profile);
  }
));

passport.serializeUser(function(user, done){
    done(null, user);
});

passport.deserializeUser(function(user, done){
    done(null, user);
});
