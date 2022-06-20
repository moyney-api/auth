import * as express from 'express';
import * as request from 'supertest';
import { Changelog } from '../../session/changelog';
import { changelog } from '../../changelog';
import { check404Methods } from '../_mocks/check-404.spec';

const app = express();
Changelog('/changelog', app);

describe('Changelog', () => {
    const changelogApp = request(app);

    it('GET', async () => {
        await changelogApp.get('/changelog')
            .expect(200)
            .expect((res) => {
                expect(res.body.length).toBeTruthy();
                expect(res.body[0].version).toBe(changelog[0].version);
            });
    });

    check404Methods(['post', 'patch', 'delete'], changelogApp, '/changelog');
});
