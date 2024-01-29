const passport = require("passport");
const passportJwt = require("passport-jwt");
const StrategyJwt = passportJwt.Strategy;
const User = require("../models/userModel");

passport.use("jwt",
  new StrategyJwt(
    {
      jwtFromRequest: function(req) {
        var token = null;
        if (req && req.cookies)
        {
            token = req.cookies['jwtToken'];
        }
        return token;
      },
      secretOrKey: "secret",
    },
    function (jwtPayload, done) {
      User.findOne({ email: jwtPayload.email } )
        .then((user) => {
          return done(null, user);
        })
        .catch((err) => {
            console.log(`err: ${err}`);
          return done(err);
        });
    }
  )
);
