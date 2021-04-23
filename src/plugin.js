const makeCreateSNSDestinationHook = (createTopic, createOrUpdateSNSDestination, logger) => async (service) => {
    const snsDestination = service.custom.snsDestination;
    if (!snsDestination.topicArn) {
        const topic = getTopicName(service);
        const { TopicArn } = await createTopic(topic);
        logger.log(`Created SNS topic ${topic}`);
        snsDestination.topicArn = TopicArn;
    }

    const { events, topicArn, configurationSets } = snsDestination;
    console.log(snsDestination,'snsDestinationLog')
    logger.log('debaging')
    const destination = getDestinationName(service);
    configurationSets.map(async configurationSet => {
        console.log(configurationSet,'configurationSetLog')
        await createOrUpdateSNSDestination(destination, configurationSet, events, topicArn);
        logger.log(`SNS destination added to configurationSet ${configurationSet}`);
    })
};

const makeRemoveSNSDestinationHook = (removeTopic, removeSNSDestination, logger) => async (service) => {
    const snsDestination = service.custom.snsDestination;
    snsDestination.configurationSets.map(async configurationSet => {
        await removeSNSDestination(getDestinationName(service), configurationSet);
        logger.log(`SNS destination removed from configurationSet ${configurationSet}`);
    })

    if (!snsDestination.topicArn) {
        const topic = getTopicName(service);
        await removeTopic(topic);
        logger.log(`SNS topic ${topic} removed`);
    }
};

const getTopicName = (service) => `${service.service}-${service.provider.stage}-SES-topic`;

const getDestinationName = (service) => `${service.service}-${service.provider.stage}-SNS-event-destination`;

module.exports = { makeCreateSNSDestinationHook, makeRemoveSNSDestinationHook };
