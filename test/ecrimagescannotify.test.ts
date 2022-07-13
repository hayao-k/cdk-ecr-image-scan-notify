import { App, Stack } from 'aws-cdk-lib';
import { Match, Template } from 'aws-cdk-lib/assertions';
import { EcrImageScanNotify } from '../src/index';


const mockApp = new App();
const stack = new Stack(mockApp);
new EcrImageScanNotify(stack, 'testing-stack', {
  webhookUrl: 'https://webhook.example.com',
});
const template = Template.fromStack(stack);

test('Lambda functions should be configured with appropriate properties and execution roles', () => {
  template.hasResourceProperties('AWS::Lambda::Function', {
    Handler: 'lambda_function.lambda_handler',
    Runtime: 'python3.9',
    Timeout: 180,
    Environment: {
      Variables: {
        WEBHOOK_URL: 'https://webhook.example.com',
      },
    },
  });

  template.hasResourceProperties('AWS::IAM::Role', {
    AssumeRolePolicyDocument: {
      Statement: [
        {
          Action: 'sts:AssumeRole',
          Effect: 'Allow',
          Principal: {
            Service: 'lambda.amazonaws.com',
          },
        },
      ],
      Version: '2012-10-17',
    },
  });
});

test('Event rule should have an event pattern for Image Scan', () => {
  template.hasResourceProperties('AWS::Events::Rule', {
    EventPattern: {
      'source': [
        'aws.ecr',
        'aws.inspector2',
      ],
      'detail-type': [
        'ECR Image Scan',
        'Inspector2 Scan',
      ],
    },
    State: 'ENABLED',
    Targets: Match.anyValue(),
  });
});