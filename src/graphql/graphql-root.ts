import { graphqlHTTP } from "express-graphql";
import { buildSchema } from "graphql";
import { google } from "googleapis";
import keys from "../config/keys";
import { createEmail } from "../google/utils";

export default function graphqlRoot() {

  return graphqlHTTP(request => {
    return {
      // language=GraphQL
      schema: buildSchema(`
          type User {
              email: String
          }

          type RootQuery {
              users: [User!]!
              domain(name: String!): [User!]!
          }

          input MessageInput {
              emails: [String!]!
              message: String!
          }

          type RootMutation {
              sendMessage(messageInput: MessageInput): String!
          }

          schema {
              query: RootQuery
              mutation: RootMutation
          }
      `),
      rootValue: {
        users: async () => {
          const auth = new google.auth.OAuth2(keys.googleClientId, keys.googleClientSecret, keys.googleAppCallback);

          try {
            const service = google.people({ version: "v1", auth })
            const { data: { connections } } = await service.people.connections.list({
              resourceName: "people/me",
              personFields: "names,emailAddresses"
            });
            if (connections) {
              return connections
                .filter(person => person.emailAddresses && person.names)
                .map(person => {
                  return {
                    email: person.emailAddresses?.[0].value
                  }
                });
            } else {
              return [];
            }
          } catch (e) {
            console.log(e);
            throw e;
          }
        },
        domain: async (name: string) => {
          return [];
        },
        sendMessage: async (arg: { messageInput: { emails: string[], message: string } }) => {
          try {
            const auth = new google.auth.OAuth2(keys.googleClientId, keys.googleClientSecret, keys.googleAppCallback);
            auth.setCredentials(JSON.parse(keys.tempToken));
            const gmail = google.gmail({version: 'v1', auth});
            for (const email of arg.messageInput.emails) {
              await gmail.users.messages.send({
                userId: "me",
                requestBody: {
                  raw: createEmail(email, "me", "title", arg.messageInput.message)
                }
              });
            }
            return "done"
          } catch (e) {
            console.log(e);
            throw e;
          }
        }
      },
      context: () => {
      },
      graphiql: true
    }
  })
}
