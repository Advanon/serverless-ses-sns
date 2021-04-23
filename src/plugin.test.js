const { makeCreateSNSDestinationHook, makeRemoveSNSDestinationHook } = require('./plugin');

const logger = { log: () => { } };
const provider = { stage: 'test' };
const service = 'test-service';

describe('plugin', () => {

    describe('createSNSDestinationHook', () => {
        test('if a SNS topic is provided, none are created', async () => {
            const createTopic = jest.fn();
            const createOrUpdateSNSDestination = jest.fn();
            const hook = makeCreateSNSDestinationHook(createTopic, createOrUpdateSNSDestination, logger);

            await hook({
                service,
                provider,
                custom: {
                    snsDestination: {
                        configurationSets: [],
                        topicArn: 'arn:....'
                    }
                }
            });

            expect(createTopic.mock.calls.length).toBe(0);
        });

        test('if a SNS topic is not provided, one is created', async () => {
            const createTopic = jest.fn(() => ({}));
            const createOrUpdateSNSDestination = jest.fn();
            const hook = makeCreateSNSDestinationHook(createTopic, createOrUpdateSNSDestination, logger);

            await hook({
                service,
                provider,
                custom: {
                    snsDestination: {
                        configurationSets: [],
                    }
                }
            });

            expect(createTopic.mock.calls.length).toBe(1);
        });
    });

    describe('removeSNSDestinationHook', () => {
        test('if a SNS topic is provided, none are removed', async () => {
            const removeTopic = jest.fn();
            const removeSNSDestination = jest.fn();
            const hook = makeRemoveSNSDestinationHook(removeTopic, removeSNSDestination, logger);

            await hook({
                service,
                provider,
                custom: {
                    snsDestination: {
                        configurationSets: [],
                        topicArn: 'arn:....'
                    }
                }
            });

            expect(removeTopic.mock.calls.length).toBe(0);
        });

        test('if a SNS topic is not provided, one is removed', async () => {
            const removeTopic = jest.fn();
            const removeSNSDestination = jest.fn();
            const hook = makeRemoveSNSDestinationHook(removeTopic, removeSNSDestination, logger);

            await hook({
                service,
                provider,
                custom: {
                    snsDestination: {
                        configurationSets: []
                    }
                }
            });

            expect(removeTopic.mock.calls.length).toBe(1);
        });
    });
});
