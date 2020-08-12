const keys =  {
  mongoURI: process.env.MONGO_URI,
  secretOrKey: process.env.SECRET_OR_KEY,
  googleClientId: process.env["GOOGLE_CLIENT_ID"],
  googleClientSecret: process.env["GOOGLE_CLIENT_SECRET"]
};

export default keys;
