import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as request from 'supertest';
import { Signup } from '~/session/routes';
import { check404Methods } from '../_mocks/check-404.spec';
import { ACTIVE_TOKEN, AdminAuthMock, NON_EXISTENT_UID } from '../_mocks/admin-auth.spec';
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
            .send({ token: ACTIVE_TOKEN, newUsername: NON_EXISTENT_UID })
            .expect((res) => {
                expect(res.status).toBe(201);
            });
    });

    check404Methods(['get', 'patch', 'delete'], signupApp, '/signup');
});
