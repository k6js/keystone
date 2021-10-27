import { graphql, graphQLSchemaExtension, list } from '@k6js/ks-next';
import { text, virtual } from '@k6js/ks-next/fields';

export const lists = {
  Something: list({
    fields: {
      text: text({ label: 'Very Important Text' }),
      virtual: virtual({
        field: graphql.field({
          type: graphql.String,
          resolve(item) {
            return item.text as string;
          },
        }),
      }),
    },
  }),
};

export const extendGraphqlSchema = graphQLSchemaExtension({
  typeDefs: `
    extend type Query {
      someNumber: Int!
    }
  `,
  resolvers: {
    Query: {
      someNumber: () => 1,
    },
  },
});
