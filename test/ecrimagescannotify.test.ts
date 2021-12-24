import * as assertions from '@aws-cdk/assertions';
import * as cdk from '@aws-cdk/core';
import { EcrImageScanNotify } from '../src/index';


test('create app', () => {
  const mockApp = new cdk.App();
  const stack = new cdk.Stack(mockApp);
  new EcrImageScanNotify(stack, 'Testtask', {
    webhookUrl: 'https://webhook.example.com',
  });
  assertions.Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Function', {
    Environment: {
      Variables: {
        WEBHOOK_URL: 'https://webhook.example.com',
      },
    },
  });
  assertions.Template.fromStack(stack).findResources('AWS::IAM::Role');
  assertions.Template.fromStack(stack).hasResourceProperties('AWS::Events::Rule', {
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
  });
});
