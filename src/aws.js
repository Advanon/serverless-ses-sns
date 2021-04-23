const isSNSDestinationAlreadyPresent = async (ses, configurationSet, name) => {
    const { EventDestinations } = await ses.describeConfigurationSet({
        ConfigurationSetName: configurationSet,
        ConfigurationSetAttributeNames: ['eventDestinations']
    }).promise();

    return EventDestinations.some(({ Name }) => Name === name);
};

// This action is idempotent, so if the requester already owns a topic with the specified name, 
// that topic's ARN is returned without creating a new topic.
const makeCreateTopic = (sns) => async (name) => sns.createTopic({ Name: name }).promise();

const makeRemoveTopic = (sns) => async (name) => {
    const createTopic = makeCreateTopic(sns);
    const { TopicArn } = await createTopic(name);
    return sns.deleteTopic({ TopicArn }).promise();
};

const makeCreateOrUpdateSNSDestination = (ses) => async (name, configurationSet, events, topicArn) => {
    const params = {
        ConfigurationSetName: configurationSet,
        EventDestination: {
            MatchingEventTypes: events,
            Name: name,
            Enabled: true,
            SNSDestination: {
                TopicARN: topicArn
            }
        }
    };
    console.log(params,'paramsSnsDestinationLog')
    const isAlreadyPresent = await isSNSDestinationAlreadyPresent(ses, configurationSet, name);
    if (isAlreadyPresent) {
        return ses.updateConfigurationSetEventDestination(params).promise();
    }

    return ses.createConfigurationSetEventDestination(params).promise();
};

const makeRemoveSNSDestination = (ses) => async (name, configurationSet) => ses.deleteConfigurationSetEventDestination({
    ConfigurationSetName: configurationSet,
    EventDestinationName: name
}).promise();

module.exports = {
    makeCreateTopic,
    makeRemoveTopic,
    makeCreateOrUpdateSNSDestination,
    makeRemoveSNSDestination
};
