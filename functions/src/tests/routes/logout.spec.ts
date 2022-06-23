import * as express from 'express';
import * as request from 'supertest';
import { Logout } from '~/session/routes';
import { check404Methods } from '../_mocks/check-404.spec';
import { ACTIVE_TOKEN, AdminAuthMock } from '../_mocks/admin-auth.spec';

const app = express();

Logout('/logout', app);
const logoutApp = request(app);

new AdminAuthMock().spyOnAll();

describe('Logout', () => {
    it('get', async () => {
        await logoutApp.get('/logout')
            .set('Authentication', `Bearer ${ACTIVE_TOKEN}`)
            .expect((res) => {
                expect(res.status).toBe(200);
            });
    });

    check404Methods(['post', 'patch', 'delete'], logoutApp, '/logout');
});
