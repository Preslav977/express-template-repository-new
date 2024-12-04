require("dotenv").config();

const express = require("express");

const path = require("node:path");

const session = require("express-session");

const pgSession = require("connect-pg-simple")(session);

const passport = require("passport");

const LocalStrategy = require("passport-local").Strategy;

const bcrypt = require("bcryptjs");

const indexRouter = require("./routes/indexRouter");

const app = express();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

const assetsPath = path.join(__dirname + "/public");

app.use(express.static(assetsPath));

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: process.env.sessionSecret,
    resave: false,
    saveUninitialized: false,
    //session options
  })
);

app.use(passport.session());

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next();
});

passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const { rows } = await pool.query(
        "SELECT * FROM users WHERE username = $1",
        [username]
      );
      const user = rows[0];

      if (!user) {
        return done(null, false, { message: "Incorrect username" });
      }
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        return done(null, false, { message: "Incorrect password" });
      }
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  })
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const { rows } = await pool.query("SELECT * FROM users WHERE id = $1", [
      id,
    ]);
    const user = rows[0];

    done(null, user);
  } catch (err) {
    done(err);
  }
});

app.post(
  "/log-in",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/",
  })
);

app.get("/log-out", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

app.use("/", indexRouter);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Express app - listening on port ${PORT}!`));

module.exports = app;
