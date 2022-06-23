import * as express from 'express';
import * as request from 'supertest';
import { Changelog } from '~/session/routes';
import { changelog } from '~/changelog';
import { check404Methods } from '../_mocks/check-404.spec';

const app = express();
Changelog('/changelog', app);
const changelogApp = request(app);

describe('Changelog', () => {
    it('get', async () => {
        await changelogApp.get('/changelog')
            .expect((res) => {
                expect(res.status).toBe(200);
                expect(res.body[0].version).toBe(changelog[0].version);
            });
    });

    check404Methods(['patch', 'post', 'delete'], changelogApp, '/changelog');
});
