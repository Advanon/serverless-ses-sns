# serverless-ses-sns

This plugin adds a [SNS](https://aws.amazon.com/sns/) topic as destination for a [SES](https://aws.amazon.com/ses/) [ConfigurationSet](https://docs.aws.amazon.com/ses/latest/DeveloperGuide/using-configuration-sets.html).

## Installation
```bash
npm install --save-dev serverless-ses-sns
```

## Usage
```yaml
plugins:
  - serverless-ses-sns

custom:
  snsDestination:
    region: <region> # If absent, self:provider.region will be used
    configurationSet: <configuration set name>
    topicArn: <topic arn> # If absent, one will be created
    events: # One or more of the following
      - renderingFailure
      - reject
      - bounce
      - send
      - complaint
      - delivery
      - open
      - click
```

## Contributing
Feedback, bug reports, and pull requests are welcome.

For pull requests, make sure to follow the following guidelines:
* Add tests for each new feature and bug fix.
* Follow the existing code style, enforced by eslint.
* Separate unrelated changes into multiple pull requests.

## License
Apache License 2.0, see [LICENSE](LICENSE.md).
