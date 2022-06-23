import { CreateRequest } from 'firebase-admin/lib/auth/auth-config';
import { DecodedIdToken } from 'firebase-admin/lib/auth/token-verifier';
import { UserRecord } from 'firebase-functions/v1/auth';
import { admin } from '../../firebase';

export const CORRECT_UID = 'my-correct-uid';
export const NON_EXISTENT_UID = 'my-wrong-uid';
export const ACTIVE_TOKEN = 'active-token';
export const REVOKED_TOKEN = 'revoked-token';
export const WRONG_TOKEN = 'wrong-token';
export const CORRECT_REMOTE_ADDRESS = '1.2.3.4';
export const WRONG_REMOTE_ADDRESS = '4.3.2.1';
export const MOCK_USER: UserRecord = {
    displayName: 'test',
    email: 'example@test.com',
    uid: CORRECT_UID,
    disabled: false,
    emailVerified: true,
    metadata: {
        creationTime: new Date().toISOString(),
        lastSignInTime: new Date().toISOString(),
        toJSON: () => ({}),
    },
    toJSON: () => ({}),
    providerData: [],
};

export class AdminAuthMock {
    token = ACTIVE_TOKEN;
    remoteAddress = CORRECT_REMOTE_ADDRESS;
    mockUser? = MOCK_USER;

    reset(): void {
        this.token = ACTIVE_TOKEN;
        this.remoteAddress = CORRECT_REMOTE_ADDRESS;
        this.mockUser = MOCK_USER;
    }

    spyOnGetUser = (): jest.SpyInstance => {
        return jest.spyOn(admin.auth(), 'getUser').mockImplementation(this.mockGetUser);
    }

    spyOnCreateUser = (): jest.SpyInstance => {
        return jest.spyOn(admin.auth(), 'createUser').mockImplementation(this.mockCreateUser);
    }

    spyOnDeleteUser = (): jest.SpyInstance => {
        return jest.spyOn(admin.auth(), 'deleteUser').mockImplementation(this.mockDeleteUser);
    }

    spyOnVerifyToken = (): jest.SpyInstance => {
        return jest.spyOn(admin.auth(), 'verifyIdToken').mockImplementation(this.mockVerifyToken);
    }

    spyOnSetCustomUserClaims = (): jest.SpyInstance => {
        return jest.spyOn(admin.auth(), 'setCustomUserClaims').mockImplementation(this.mockSetCustomUserClaims);
    }

    spyRevokeRefreshTokens = (): jest.SpyInstance => {
        return jest.spyOn(admin.auth(), 'revokeRefreshTokens').mockImplementation(this.mockRevokeRefreshTokens);
    }

    spyOnAll = (): jest.SpyInstance[] => {
        return [
            this.spyOnGetUser(),
            this.spyOnCreateUser(),
            this.spyOnDeleteUser(),
            this.spyOnVerifyToken(),
            this.spyOnSetCustomUserClaims(),
            this.spyRevokeRefreshTokens(),
        ];
    }

    private mockGetUser = (uid: string): Promise<UserRecord> => {
        return new Promise((resolve, reject) => {
            if (uid !== NON_EXISTENT_UID && this.mockUser) {
                resolve(Object.assign({}, this.mockUser, { uid }));
            }

            reject(new Error('User not found'));
        });
    }

    private mockCreateUser = (newUser: CreateRequest): Promise<UserRecord> => {
        return new Promise((resolve, reject) => {
            if (newUser.uid === this.mockUser?.uid) {
                resolve(this.mockUser!);
            } else if (!Object.values(newUser).filter(Boolean).length) {
                this.mockUser = MOCK_USER;
                resolve(this.mockUser);
            } else if (newUser.uid === NON_EXISTENT_UID) {
                this.mockUser = Object.assign({}, MOCK_USER, newUser);
                resolve(this.mockUser);
            }

            reject(new Error('Username taken'));
        });
    }

    private mockDeleteUser = (uid: string): Promise<void> => {
        return new Promise((resolve, reject) => {
            if (uid !== NON_EXISTENT_UID) {
                delete this.mockUser;
                resolve();
            }

            reject(new Error('User does not exist'));
        });
    }

    private mockVerifyToken = (token: string, checkRevoked?: boolean): Promise<DecodedIdToken> => {
        return new Promise((resolve, reject) => {
            if (checkRevoked) {
                if (token === ACTIVE_TOKEN) {
                    resolve({ uid: CORRECT_UID, remoteAddress: CORRECT_REMOTE_ADDRESS } as DecodedIdToken & { remoteAddress: string });
                }

                reject(new Error('{"code":"auth/id-token-revoked","message":"The Firebase ID token has been revoked."}'))
            } else {
                if (token === REVOKED_TOKEN) {
                    reject(new Error('Unauthorized'));
                }

                resolve({ uid: CORRECT_UID, remoteAddress: CORRECT_REMOTE_ADDRESS } as DecodedIdToken & { remoteAddress: string });
            }
        });
    }

    private mockSetCustomUserClaims = (uid: string, claims: object | null): Promise<void> => {
        return new Promise((resolve) => {
            resolve();
        });
    }

    private mockRevokeRefreshTokens = (): Promise<void> => {
        return new Promise((resolve) => {
            this.token = REVOKED_TOKEN;
            resolve();
        });
    }
}
