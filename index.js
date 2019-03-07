const {
    makeCreateOrUpdateSNSDestination,
    makeRemoveSNSDestination,
    makeCreateTopic,
    makeRemoveTopic
} = require('./src/aws');
const { makeCreateSNSDestinationHook, makeRemoveSNSDestinationHook } = require('./src/plugin');

class ServerlessSESConfigurationSetSNSDestination {

    constructor(serverless, options) {
        this.serverless = serverless;
        this.options = options;

        const provider = this.serverless.getProvider('aws');
        const awsCredentials = provider.getCredentials();
        const region = this.serverless.service.custom.snsDestination.region || awsCredentials.region;
        const credentials = awsCredentials.credentials;

        const ses = new provider.sdk.SES({ region, credentials });
        const sns = new provider.sdk.SNS({ region, credentials });

        const createTopic = makeCreateTopic(sns);
        const removeTopic = makeRemoveTopic(sns);
        const createOrUpdateSNSDestination = makeCreateOrUpdateSNSDestination(ses);
        const removeSNSDestination = makeRemoveSNSDestination(ses);

        const logger = this.serverless.cli;
        const createHook = makeCreateSNSDestinationHook(createTopic, createOrUpdateSNSDestination, logger);
        const removeHook = makeRemoveSNSDestinationHook(removeTopic, removeSNSDestination, logger);

        this.hooks = {
            'after:deploy:deploy': () => createHook(this.serverless.service),
            'before:remove:remove': () => removeHook(this.serverless.service)
        };
    }
}

module.exports = ServerlessSESConfigurationSetSNSDestination;
