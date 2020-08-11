import { graphqlHTTP } from "express-graphql";
import { buildSchema } from "graphql";

export default function graphqlRoot() {
  return graphqlHTTP({
    // language=GraphQL
    schema: buildSchema(`
        type RootQuery {
            messages: [String!]!
        }

        type RootMutation {
            createMessage: String!
        }

        schema {
            query: RootQuery
            mutation: RootMutation
        }
    `),
    rootValue: {
      messages: () => ["hi"]
    },
    graphiql: true
  })
}
