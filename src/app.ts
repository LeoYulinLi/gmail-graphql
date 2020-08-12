import express from "express";
import bodyParser from "body-parser";
import graphqlRoot from "./graphql/graphql-root";
import passport from "passport";
import configPassport from "./config/passport";
import session from "express-session";
import mongoose from "mongoose";
import keys from "./config/keys";

const app = express();
app.use(bodyParser.json());
app.use(session({
  secret: keys.secretOrKey
}));
app.use(passport.initialize());
configPassport(passport);
app.use(passport.session());

mongoose
  .connect(keys.mongoURI, { useNewUrlParser: true })
  .then(() => console.log("Connected to MongoDB successfully"))
  .catch(err => console.log(err));

app.get("/auth/google", passport.authenticate("google", {
  scope: [
    'https://www.googleapis.com/auth/contacts.readonly',
    'https://www.googleapis.com/auth/gmail.send',
  ]
}));

app.get("/auth/google/callback", passport.authenticate("google"));

app.use("/api", graphqlRoot());

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server is running on port ${ port }`));
