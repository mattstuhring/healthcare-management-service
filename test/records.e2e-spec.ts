import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('RecordsController (E2E)', () => {
  let app: INestApplication;
  let token = null;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    const response = await request(app.getHttpServer())
      .post('/auth/signin')
      .send({ username: 'admin', password: 'Password1!' })
      .expect(201);

    token = response.body.accessToken;
  });

  afterAll(async () => {
    await app.close();
  });

  it('/records (GET) 401 Unauthorized - Missing JWT token', () => {
    return request(app.getHttpServer()).get('/records').expect(401);
  });

  it('/records (GET) 401 Unauthorized - Expired JWT token', () => {
    const expiredToken =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwiaWF0IjoxNjcwNjEzNjEwLCJleHAiOjE2NzA2MTcyMTB9.Wp0F2t3YmiwyOWpyHmDg3b73vqKJMZifNwT1iZlww1Y';

    return request(app.getHttpServer())
      .get('/records')
      .send()
      .set('Authorization', 'Bearer ' + expiredToken)
      .expect(401);
  });

  it('/records (GET) 200 Authorized - Valid JWT token', () => {
    return request(app.getHttpServer())
      .get('/records')
      .send()
      .set('Authorization', 'Bearer ' + token)
      .expect(200);
  });
});
