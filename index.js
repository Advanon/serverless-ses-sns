const {
    makeCreateOrUpdateSNSDestination,
    makeRemoveSNSDestination,
    makeCreateTopic,
    makeRemoveTopic
} = require('./src/aws');
const { makeCreateSNSDestinationHook, makeRemoveSNSDestinationHook } = require('./src/plugin');

const getClients = (serverless) => {
    const provider = serverless.getProvider('aws');
    const awsCredentials = provider.getCredentials();
    const region = serverless.service.custom.snsDestination.region || awsCredentials.region;
    const credentials = awsCredentials.credentials;

    return {
        ses: new provider.sdk.SES({ region, credentials }),
        sns: new provider.sdk.SNS({ region, credentials })
    }
}

const makeCreateHook = (serverless) => {
    const { ses, sns } = getClients(serverless);
    const createTopic = makeCreateTopic(sns);
    const createOrUpdateSNSDestination = makeCreateOrUpdateSNSDestination(ses);

    return makeCreateSNSDestinationHook(createTopic, createOrUpdateSNSDestination, serverless.cli);
};

const makeRemoveHook = (serverless) => {
    const { ses, sns } = getClients(serverless);
    const removeTopic = makeRemoveTopic(sns);
    const removeSNSDestination = makeRemoveSNSDestination(ses);

    return makeRemoveSNSDestinationHook(removeTopic, removeSNSDestination, serverless.cli);
}

class ServerlessSESConfigurationSetSNSDestination {

    constructor(serverless, options) {
        this.serverless = serverless;
        this.options = options;

        if (!serverless.service.custom.snsDestination) {
            this.serverless.cli.log(`Missing configuration for plugin serverless-ses-sns`);
        } else {
            this.hooks = this.setupHooks();
        }
    }

    setupHooks() {
        return {
            'after:deploy:deploy': () => makeCreateHook(this.serverless)(this.serverless.service),
            'before:remove:remove': () => makeRemoveHook(this.serverless)(this.serverless.service)
        };
    }
}

module.exports = ServerlessSESConfigurationSetSNSDestination;
