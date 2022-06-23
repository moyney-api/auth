import * as express from 'express';
import * as request from 'supertest';
import { Status } from '~/session/routes';
import { check404Methods } from '../_mocks/check-404.spec';
import { ACTIVE_TOKEN, AdminAuthMock, CORRECT_UID } from '../_mocks/admin-auth.spec';
import { spyOnCheckStatus } from '../_mocks/auth.model.spec';

const app = express();

Status('/status', app);
const statusApp = request(app);

new AdminAuthMock().spyOnAll();
spyOnCheckStatus();

describe('Status', () => {
    it('get', async () => {
        await statusApp.get('/status')
            .set('Authentication', `Bearer ${ACTIVE_TOKEN}`)
            .expect((res) => {
                expect(res.status).toBe(200);
                expect(res.body.uid).toBe(CORRECT_UID);
            });
    });

    check404Methods(['post', 'patch', 'delete'], statusApp, '/status');
});
