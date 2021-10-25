import { list } from '@k6js/ks-next';
import { text } from '@k6js/ks-next/fields';
import { setupTestRunner } from '@k6js/ks-next/testing';
import supertest from 'supertest';
import { apiTestConfig } from './utils';

const runner = setupTestRunner({
  config: apiTestConfig({
    lists: { User: list({ fields: { name: text() } }) },
    server: {
      extendExpressApp: app => {
        app.get('/magic', (req, res) => {
          res.json({ magic: true });
        });
      },
    },
  }),
});

test(
  'basic extension',
  runner(async ({ app }) => {
    const { text } = await supertest(app)
      .get('/magic')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200);
    expect(JSON.parse(text)).toEqual({
      magic: true,
    });
  })
);
