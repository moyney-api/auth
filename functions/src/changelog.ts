export const changelog: Changelog = [
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
type Changelog = (ChangelogChanges | ChangelogTechChanges)[];
