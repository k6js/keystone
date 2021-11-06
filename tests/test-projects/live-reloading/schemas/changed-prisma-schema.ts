import { graphQLSchemaExtension, list } from '@k6js/ks-next';
import { text } from '@k6js/ks-next/fields';

export const lists = {
  Something: list({
    fields: {
      text: text({ label: 'Initial Label For Text' }),
      anotherField: text(),
    },
  }),
};

export const extendGraphqlSchema = graphQLSchemaExtension({
  typeDefs: `
    extend type Query {
      someNumber: Int
    }
  `,
  resolvers: {
    Query: {
      someNumber: () => 1,
    },
  },
});
