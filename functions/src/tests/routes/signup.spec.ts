import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as request from 'supertest';
import { Signup } from 'src/session/routes';
import { check404Methods } from '../_mocks/check-404.spec';
import { ACTIVE_TOKEN, AdminAuthMock } from '../_mocks/admin-auth.spec';
import { spyOnCheckStatus } from '../_mocks/auth.model.spec';

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

Signup('/signup', app);
const signupApp = request(app);

new AdminAuthMock().spyOnAll();
spyOnCheckStatus();

describe('Signup', () => {
    it('post', async () => {
        await signupApp.post('/signup')
            .send({ token: ACTIVE_TOKEN, newUsername: 'other-uid' })
            .expect((res) => {
                expect(res.status).toBe(201);
            });
    });

    check404Methods(['get', 'patch', 'delete'], signupApp, '/signup');
});
