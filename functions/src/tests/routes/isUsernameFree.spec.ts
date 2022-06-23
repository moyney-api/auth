import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as request from 'supertest';
import { IsUsernameFree } from '~/session/routes';
import { check404Methods } from '../_mocks/check-404.spec';
import { AdminAuthMock, CORRECT_UID, NON_EXISTENT_UID } from '../_mocks/admin-auth.spec';

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

IsUsernameFree('/isUsernameFree', app);
const signupApp = request(app);

new AdminAuthMock().spyOnAll();

describe('IsUsernameFree', () => {
    it('post free user', async () => {
        await signupApp.post('/isUsernameFree')
            .send({ username: NON_EXISTENT_UID })
            .expect((res) => {
                expect(res.status).toBe(200);
                expect(res.body).toEqual({ username: NON_EXISTENT_UID, isFree: true });
            });
    });

    it('post taken user', async () => {
        await signupApp.post('/isUsernameFree')
            .send({ username: CORRECT_UID })
            .expect((res) => {
                expect(res.status).toBe(200);
                expect(res.body).toEqual({ username: CORRECT_UID, isFree: false });
            });
    });

    check404Methods(['get', 'patch', 'delete'], signupApp, '/isUsernameFree');
});
