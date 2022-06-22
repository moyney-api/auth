import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as request from 'supertest';
import { Login } from 'src/session/routes';
import { check404Methods } from '../_mocks/check-404.spec';
import { ACTIVE_TOKEN, AdminAuthMock } from '../_mocks/admin-auth.spec';

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

Login('/login', app);
const loginApp = request(app);

new AdminAuthMock().spyOnAll();

describe('Login', () => {
    it('post', async () => {
        await loginApp.post('/login')
            .send({ token: ACTIVE_TOKEN })
            .expect((res) => {
                expect(res.status).toBe(200);
                expect(res.body.token).toBe(ACTIVE_TOKEN);
            });
    });

    check404Methods(['get', 'patch', 'delete'], loginApp, '/login');
});
