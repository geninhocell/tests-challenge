/* eslint-disable import/no-extraneous-dependencies */
import request from 'supertest';
import { Connection, createConnection } from 'typeorm';

import { app } from '../../../../app';

let connection: Connection;

describe('[Authenticate User Controller]', () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it('should be able to create a new session', async () => {
    await request(app).post('/api/v1/users').send({
      name: 'Test',
      email: 'test_1@mail.com',
      password: '123123'
    });

    const response = await request(app).post('/api/v1/sessions').send({
      email: 'test_1@mail.com',
      password: '123123'
    });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');
  });

  it('should not be able to create a new session with user unregistered', async () => {
    const response = await request(app).post('/api/v1/sessions').send({
      email: 'unregistered@mail.com',
      password: '123123'
    });

    expect(response.status).toBe(401)
  });

  it('should not be able to create a new session with password wrong', async () => {
    await request(app).post('/api/v1/users').send({
      name: 'Test',
      email: 'test_3@mail.com',
      password: '123123'
    });

    const response = await request(app).post('/api/v1/sessions').send({
      email: 'test_3@mail.com',
      password: 'wrong'
    });

    expect(response.status).toBe(401)
  });
});
