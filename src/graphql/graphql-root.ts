import { graphqlHTTP } from "express-graphql";
import { buildSchema } from "graphql";
import { allUsers, createEmail, gmailService, peopleService, sendGmail } from "../google/utils";

export interface MessageInput {
  emails: string[]
  title: string
  body: string
}

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
              title: String!
              body: String!
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
        sendMessage: async (arg: { messageInput: MessageInput }) => {
          const gmail = gmailService();
          for (const emailAddress of arg.messageInput.emails) {
            await sendGmail(gmail, emailAddress, arg.messageInput);
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
