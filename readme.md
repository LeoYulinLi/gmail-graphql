# Gmail GraphQL

## How to run
- Build: `yarn build`
- Run: `yarn start`

Server will be listing on 5000, unless specified by a `PORT` environment variable.

Note: for now OAuth is not completed, so the token is set into `tempToken`
property of `src/config/keys_dev.ts` with a string of JSON.

Here is a sample `keys_dev.ts`

```typescript
const keys = {
  mongoURI:
    "mongodb+srv://sample:sample@sp.sample.mongodb.net/sp?retryWrites=true&w=majority",
  secretOrKey: "bad secret",
  googleClientId: "something.apps.googleusercontent.com",
  googleClientSecret: "some secret",
  tempToken: "{\"access_token\":\"not token\",\"refresh_token\":\"not token\",\"scope\":\"https://www.googleapis.com/auth/contacts.readonly https://www.googleapis.com/auth/gmail.send https://www.googleapis.com/auth/gmail.readonly\",\"token_type\":\"Bearer\",\"expiry_date\":1697198894820}"
};

export default keys;
```

## Environment Variables
- `PORT` port server listing on
- `MONGO_URI` url to mongodb (required)
- `SECRET_OR_KEY` secret for session (required)
- `GOOGLE_CLIENT_ID` Google API client ID (required)
- `GOOGLE_CLIENT_SECRET` Google API secret (required)

## Routes
### `GET /auth/google`
initiate a Google oAuth

### `GET /auth/google/callback`
call back for Google oAuth, does not work at this moment

### `POST /api`
graphql end point
#### Types
```
type User {
   email: String
}
```

#### Query
```
users: [User!]!
search(name: String!): [User!]!
```

#### Mutation
```
# returns only a "done" string
sendMessage(messageInput: MessageInput): String!
```

#### Samples
##### Search for contacts
```graphql
query {
  search(name: "@yahoo") {
    email
  }
}
```
response
```json
{
  "data": {
    "search": [
      {
        "email": "a@yahoo.co.jp"
      }, {
        "email": "b@yahoo.com"
      }
    ]
  }
}
```

##### Send message
```graphql
mutation {
  sendMessage(messageInput: { emails: ["a@b.co", "d@e.co"], message: "test" })
}
```
response
```json
{
  "data": {
    "sendMessage": "done"
  }
}
```
