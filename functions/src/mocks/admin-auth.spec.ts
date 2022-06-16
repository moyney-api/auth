import { DecodedIdToken } from 'firebase-admin/lib/auth/token-verifier';
import { admin } from '../firebase';

export const adminAuthMock = {
    mockUid: 'my-mock-uid',
    mockToken: 'my-correct-token',
    mockRemoteAddress: '1.2.3.4',
    spyOnVerifyIdToken(): jest.SpyInstance {
        return jest.spyOn(admin.auth(), 'verifyIdToken').mockImplementation((token: string) => {
            return new Promise((resolve) => {
                if (token === adminAuthMock.mockToken) {
                    resolve(<DecodedIdToken & { remoteAddress: string }>{
                        uid: adminAuthMock.mockUid,
                        remoteAddress: adminAuthMock.mockRemoteAddress,
                    });
                } else {
                    throw new Error('Unauthorized');
                }
            });
        });
    },
    spyOnSetCustomUserClaims(): jest.SpyInstance {
        return jest.spyOn(admin.auth(), 'setCustomUserClaims').mockImplementation((uid: string) => {
            return new Promise((resolve) => {
                if (uid === adminAuthMock.mockUid) {
                    resolve();
                } else {
                    throw new Error('Unauthorized');
                }
            });
        })
    },
    spyOnRevokeRefreshToken(): jest.SpyInstance {
        return jest.spyOn(admin.auth(), 'revokeRefreshTokens').mockImplementation((uid: string) => {
            return new Promise((resolve) => {
                if (uid === adminAuthMock.mockUid) {
                    resolve();
                } else {
                    throw new Error('Forbidden');
                }
            });
        });
    }
};
