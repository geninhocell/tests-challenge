/* eslint-disable import/no-extraneous-dependencies */
import request from 'supertest';
import { Connection, createConnection } from 'typeorm';

import { app } from '../../../../app';

let connection: Connection;

describe('[Get Statement Operation Controller]', () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it('should be able to show statement operation', async () => {
    await request(app).post('/api/v1/users').send({
      name: 'Test',
      email: 'test_1@mail.com',
      password: '123123'
    });

    const responseToken = await request(app).post('/api/v1/sessions').send({
      email: 'test_1@mail.com',
      password: '123123'
    });

    const { token } = responseToken.body;

    const responseStatement = await request(app)
      .post('/api/v1/statements/deposit')
      .send({
        amount: 100,
        description: 'bank',
      })
      .set({
        Authorization: `Bearer ${token}`,
      });

    const { id } = responseStatement.body;

    const response = await request(app)
      .get(`/api/v1/statements/${id}`)
      .set({ Authorization: `Bearer ${token}` });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id');
  });
});
