import * as cdk from '@aws-cdk/core';
import { EcrImageScanNorify } from '../src/index';
import '@aws-cdk/assert/jest';


test('create app', () => {
  const mockApp = new cdk.App();
  const stack = new cdk.Stack(mockApp);
  new EcrImageScanNorify(stack, 'Testtask', {
    webhookUrl: 'https://webhook.example.com',
    channel: 'event_channel',
  });
  expect(stack).toHaveResource('AWS::Lambda::Function', {
    Environment: {
      Variables: {
        WEBHOOK_URL: 'https://webhook.example.com',
        CHANNEL: 'event_channel',
      },
    },
  });
  expect(stack).toHaveResource('AWS::IAM::Role');
  expect(stack).toHaveResource('AWS::IAM::Policy', {
    PolicyDocument: {
      Statement: [
        {
          Action: 'ecr:DescribeImages',
          Effect: 'Allow',
          Resource: '*',
        },
      ],
      Version: '2012-10-17',
    },
  });
});