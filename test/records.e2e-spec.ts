import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { AuthLoginUserDto } from '../src/auth/dtos/auth-login-user.dto';

describe('Records controller (e2e)', () => {
  let app: INestApplication;
  let token;

  const credentials: AuthLoginUserDto = {
    username: 'test@gmail.com',
    password: 'Password1!',
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    /**
     * Generate JWT token
     * User must exist in the database.
     */
    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send(credentials)
      .expect(201);

    token = response.body.accessToken;
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/records GET', () => {
    it('200 OK - Authorized ADMIN', () => {
      console.log(token);
      return request(app.getHttpServer())
        .get('/records')
        .set('Authorization', 'Bearer ' + token)
        .send()
        .expect(200);
    });

    it('200 OK - Authorized EMPLOYEE', () => {
      console.log(token);
      return request(app.getHttpServer())
        .get('/records')
        .set('Authorization', 'Bearer ' + token)
        .send()
        .expect(200);
    });

    it('403 Forbidden - Unauthorized', () => {
      return request(app.getHttpServer()).get('/records').send().expect(403);
    });

    // it('401 Unauthorized - Expired JWT token', () => {
    //   const expiredToken =
    //     'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InRlc3RAZ21haWwuY29tIiwicm9sZSI6eyJpZCI6ImIwMjc0MzkwLThlYTktNDk2NS04NzJiLWJiZmRlMTM4MjBjNiIsIm5hbWUiOiJBRE1JTiIsImNyZWF0ZSI6dHJ1ZSwicmVhZCI6dHJ1ZSwidXBkYXRlIjp0cnVlLCJkZWxldGUiOnRydWUsImNyZWF0ZWRBdCI6IjIwMjMtMDMtMDFUMDQ6MjQ6MzAuMTI2WiIsInVwZGF0ZWRBdCI6IjIwMjMtMDMtMDFUMDQ6MjQ6MzAuMTI2WiJ9LCJpYXQiOjE2ODAwNTg2ODYsImV4cCI6MTY4MDA2MDQ4Nn0.uFq6YowAZiBVqtV0-KkrK1pbEpaZ1CKI8HyYLuMFU2A';

    //   return request(app.getHttpServer())
    //     .get('/records')
    //     .set('Authorization', 'Bearer ' + expiredToken)
    //     .send()
    //     .expect(401);
    // });
  });
});
