import { graphqlHTTP } from "express-graphql";
import { buildSchema } from "graphql";
import { google } from "googleapis";
import keys from "../config/keys";

export default function graphqlRoot() {

  return graphqlHTTP({
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
      users: async (args: undefined, req: any) => {
        console.log(req());
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
      sendMessage: async ({ emails, message }: { emails: string[], message: string }) => {

      }
    },
    context: () => "hi",
    graphiql: true
  })
}
