import * as express from 'express';
import * as request from 'supertest';
import { Help, helpMessage } from '../../session/help';
import { check404Methods } from '../_mocks/check-404.spec';

const app = express();
Help('/', app);

describe('Help', () => {
    const helpApp = request(app);

    it('GET', async () => {
        await helpApp
            .get('/')
            .expect(200)
            .expect((res) => {
                expect(res.text).toBe(helpMessage);
            });
    });

    check404Methods(['post', 'patch', 'delete'], helpApp, '/');
});
