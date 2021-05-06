/* eslint-disable import/no-extraneous-dependencies */
import request from 'supertest';
import { Connection, createConnection } from 'typeorm';

import { app } from '../../../../app';

let connection: Connection;

describe('[Create Statement Controller]', () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it('should be able to create statement deposit', async () => {
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

    const response = await request(app)
      .post('/api/v1/statements/deposit')
      .send({
        amount: 100,
        description: 'bank',
      })
      .set({
        Authorization: `Bearer ${token}`,
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('type');
    expect(response.body).toHaveProperty('id');
  });

  it('should be able to create statement withdraw', async () => {
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

    const response = await request(app)
      .post('/api/v1/statements/withdraw')
      .send({
        amount: 0,
        description: 'bank',
      })
      .set({
        Authorization: `Bearer ${token}`,
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('type');
    expect(response.body).toHaveProperty('id');
  });

  it('should not be able to create statement withdraw with insufficient founds', async () => {
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

    const response = await request(app)
      .post('/api/v1/statements/withdraw')
      .send({
        amount: 110,
        description: 'bank',
      })
      .set({
        Authorization: `Bearer ${token}`,
      });

    expect(response.status).toBe(400);
  });
});
