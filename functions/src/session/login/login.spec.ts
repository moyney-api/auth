import * as express from 'express';
import * as request from 'supertest';
import * as bodyParser from 'body-parser';
import { check404Methods } from '../../mocks/check-404.spec';
import { Login } from './login';
import { adminAuthMock } from '../../mocks/admin-auth.spec';

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
Login('/login', app);

const { mockToken, spyOnSetCustomUserClaims, spyOnVerifyIdToken } = adminAuthMock;

describe('Login', () => {
    const loginApp = request(app);

    const tokenSpy = spyOnVerifyIdToken();
    const claimsSpy = spyOnSetCustomUserClaims();

    describe('POST', () => {
        beforeEach(() => jest.clearAllMocks());

        it('should login correctly with correct token on post', async () => {
            await loginApp.post('/login')
                .send({ token: mockToken })
                .expect((res) => {
                    expect(tokenSpy).toHaveBeenCalledTimes(1);
                    expect(claimsSpy).toHaveBeenCalledTimes(1);
                    expect(res.status).toBe(200);
                    expect(res.body.token).toBe(mockToken);
                });
        });

        it('should error 401 if token is incorrect', async () => {
            await loginApp.post('/login')
                .send({ token: 'wrong-token' })
                .expect((res) => {
                    expect(tokenSpy).toHaveBeenCalledTimes(1);
                    expect(claimsSpy).not.toHaveBeenCalled();
                    expect(res.status).toBe(401);
                    expect(res.unauthorized).toBe(true);
                });

        });

        it('should error 401 if no token is provided', async () => {
            await loginApp.post('/login')
                .expect((res) => {
                    expect(tokenSpy).toHaveBeenCalledTimes(1);
                    expect(claimsSpy).not.toHaveBeenCalled();
                    expect(res.status).toBe(401);
                    expect(res.unauthorized).toBe(true);
                });
        })
    });

    check404Methods(['get', 'patch', 'delete'], loginApp, '/login');
});
