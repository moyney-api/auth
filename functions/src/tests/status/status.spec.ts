import * as express from 'express';
import * as request from 'supertest';
import { check404Methods } from '../_mocks/check-404.spec';
import { Status } from '../../session/status';
import { adminAuthMock } from '../_mocks/admin-auth.spec';
import * as helpers from '../../session/helpers';

const app = express();
Status('/status', app);

const { mockToken, mockUid, mockRemoteAddress, spyOnVerifyIdToken } = adminAuthMock;

describe('Status', () => {
    const statusApp = request(app);
    const tokenSpy = spyOnVerifyIdToken();

    const tokenAddressSpy = jest.spyOn(helpers, 'getTokenAndRemoteAddress');
    tokenAddressSpy.mockImplementationOnce(() => ({ remoteAddress: mockRemoteAddress, token: mockToken }));
    tokenAddressSpy.mockImplementationOnce(() => ({ remoteAddress: '3.2.4.1', token: mockToken }));
    tokenAddressSpy.mockImplementationOnce(() => ({ remoteAddress: mockRemoteAddress, token: 'wrong-token' }));

    describe('GET', () => {
        it('should return correct uid when correct token is passed', async () => {
            await statusApp.get('/status')
                .expect((res) => {
                    expect(tokenSpy).toHaveBeenCalledTimes(1);
                    expect(res.status).toBe(200);
                    expect(res.body.uid).toBe(mockUid);
                });
        });

        it('should return unauthorized when remoteAddress is different', async () => {
            await statusApp.get('/status')
                .expect((res) => {
                    expect(tokenSpy).toHaveBeenCalledTimes(2);
                    expect(res.status).toBe(401);
                    expect(res.unauthorized).toBe(true);
                });
        });

        it('should return unauthorized when wrong token is used', async () => {
            await statusApp.get('/status')
                .expect((res) => {
                    expect(tokenSpy).toHaveBeenCalledTimes(3);
                    expect(res.status).toBe(401);
                    expect(res.unauthorized).toBe(true);
                });
        });
    });

    check404Methods(['post', 'patch', 'delete'], statusApp, '/status');
});
