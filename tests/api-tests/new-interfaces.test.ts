import { list } from '@k6js/ks-next';
import { text } from '@k6js/ks-next/fields';
import { setupTestRunner } from '@k6js/ks-next/testing';
import { apiTestConfig } from './utils';

const runner = setupTestRunner({
  config: apiTestConfig({
    lists: {
      User: list({ fields: { name: text() } }),
    },
  }),
});

test(
  'Smoke test',
  runner(async ({ context }) => {
    const users = await context.db.User.findMany({});
    expect(users).toEqual([]);
  })
);
