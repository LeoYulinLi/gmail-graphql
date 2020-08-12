import { graphqlHTTP } from "express-graphql";
import { buildSchema } from "graphql";
import { allUsers, createEmail, gmailService, peopleService, sendGmail } from "../google/utils";

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
              search(name: String!): [User!]!
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
          return allUsers(peopleService());
        },
        search: async (arg: { name: string }) => {
          return allUsers(peopleService(), person => {
            if (person.emailAddresses) {
              return person.emailAddresses.some(e => e.value?.includes(arg.name));
            } else {
              return false;
            }
          });
        },
        sendMessage: async (arg: { messageInput: { emails: string[], message: string } }) => {
          const gmail = gmailService();
          for (const email of arg.messageInput.emails) {
            await sendGmail(gmail, email, arg.messageInput.message);
          }
          return "done";
        }
      },
      context: () => {
      },
      graphiql: true
    }
  })
}
