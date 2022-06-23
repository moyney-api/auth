import * as express from 'express';
import * as request from 'supertest';
import { Help, helpMessage } from '~/session/routes';
import { check404Methods } from '../_mocks/check-404.spec';

const app = express();
Help('/help', app);
const helpApp = request(app);

describe('Help', () => {
    it('get', async () => {
        await helpApp.get('/help')
            .expect((res) => {
                expect(res.status).toBe(200);
                expect(res.text).toBe(helpMessage);
            });
    });

    check404Methods(['patch', 'post', 'delete'], helpApp, '/help');
});
