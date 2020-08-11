
let keys: {
  mongoURI: string,
  secretOrKey: string,
  googleClientId: string,
  googleClientSecret: string,
  googleAppCallback: string
};

if (process.env.NODE_ENV === 'production') {
  keys = require('./keys_prod').default;
} else {
  keys = require('./keys_dev').default;
}

export default keys;
