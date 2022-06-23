export const changelog: Changelog = [
    {
        version: '0.1.5',
        changes: [
            'Created endpoint for `isUsernameFree`',
        ],
        techChanges: [
            'Updated compiler for proper typescript alias recognition',
            'Separated checking if username exists from signup endpoint',
            'Updated tests to include previous change',
        ]
    },
    {
        version: '0.1.4',
        techChanges: ['Tests redone so they mirror the struct of the app'],
    },
    {
        version: '0.1.3',
        techChanges: ['Moved tests to it\'s own folder'],
    },
    {
        version: '0.1.2',
        techChanges: ['Added tests with jest and supertest'],
    },
    {
        version: '0.1.1',
        techChanges: [
            'Made controllers become more scoped to their routes',
            'Changelog now has a properly defined type'
        ],
    },
    {
        version: '0.1.0',
        changes: [
            'First version of auth with basic endpoints created',
            'Changelog endpoint created',
        ],
    },
    {
        version: '0.0.2',
        changes: [
            'Added test for microservice existence',
            'Created first endpoint ',
        ],
    },
    {
        version: '0.0.1',
        changes: ['First commit'],
    }
];

interface ChangelogVersion {
    version: `${number}.${number}.${number}`;
}
interface ChangelogChanges extends ChangelogVersion {
    changes: string[];
}
interface ChangelogTechChanges extends ChangelogVersion {
    techChanges: string[];
}
export type Changelog = (ChangelogChanges | ChangelogTechChanges)[];
