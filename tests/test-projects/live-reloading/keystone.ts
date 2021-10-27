import { config } from '@k6js/ks-next';
import { lists, extendGraphqlSchema } from './schemas';

export default config({
  db: {
    provider: 'sqlite',
    url: process.env.DATABASE_URL || 'file:./test.db',
  },
  lists,
  extendGraphqlSchema,
});
