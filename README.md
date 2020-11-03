# cdk-ecr-image-scan-notify
cdk-ecr-image-scan-notify is an AWS CDK construct library that notify the slack channel of Amazon ECR image scan results. 

![](https://github.com/hayao-k/ecr-image-scan-findings-to-slack/raw/master/docs/images/slack-notification.png)

Click on an image name to go to the scan results page.

![](https://github.com/hayao-k/ecr-image-scan-findings-to-slack/raw/master/docs/images/scan-result.png)

## Getting Started
### TypeScript
Installation

```
$ yarn add cdk-ecr-image-scan-notify
```

Usage

```ts
import * as cdk from '@aws-cdk/core';
import { EcrImageScanNotify } from 'cdk-ecr-image-scan-notify';

const mockApp = new cdk.App();
const stack = new cdk.Stack(mockApp, '<your-stack-name>');

new EcrImageScanNotify(stack, 'ecr-image-scan-notify', {
  webhookUrl: '<your-incoming-webhook-url>',
  channel: '<your-slack-channel-name>',
});
```

Deploy!

```
$ cdk deploy
```

## Overview
Amazon EventBridge (CloudWatch Events) detects the image scan execution and starts the Lambda function.
The Lambda function uses the DescribeImages API to get a summary of the scan results, formatting them and notifying Slack.

![](https://github.com/hayao-k/ecr-image-scan-findings-to-slack/raw/master/docs/images/architecture.png)