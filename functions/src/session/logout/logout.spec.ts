import * as express from 'express';
import * as request from 'supertest';
import { check404Methods } from '../../mocks/check-404.spec';
import { Logout } from './logout';
import { adminAuthMock } from '../../mocks/admin-auth.spec';

const app = express();
Logout('/logout', app);

describe('Logout', () => {
    const logoutApp = request(app);
    const { mockToken, spyOnVerifyIdToken, spyOnRevokeRefreshToken } = adminAuthMock;
    const verifyToken = spyOnVerifyIdToken();
    const revokeTokens = spyOnRevokeRefreshToken();

    describe('GET', () => {
        beforeEach(() => jest.clearAllMocks());

        it('should logout correctly with correct token', async () => {
            await logoutApp.get('/logout')
                .set('Authorization', `Bearer ${mockToken}`)
                .expect((res) => {
                    expect(verifyToken).toHaveBeenCalledTimes(1);
                    expect(revokeTokens).toBeCalledTimes(1);
                    expect(res.status).toBe(200);
                    expect(res.text).toBe('Signed out');
                });
        });

        it('logout should return a 403 if no token is provided', async () => {
            await logoutApp.get('/logout')
                .expect((res) => {
                    expect(verifyToken).toHaveBeenCalledTimes(1);
                    expect(revokeTokens).not.toHaveBeenCalled();
                    expect(res.status).toBe(403);
                    expect(res.forbidden).toBe(true);
                });

        });
    });

    check404Methods(['post', 'patch', 'delete'], logoutApp, '/logout');
});
