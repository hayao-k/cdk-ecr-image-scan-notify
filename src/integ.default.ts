import * as cdk from '@aws-cdk/core';
import { EcrImageScanNotify } from './index';

const mockApp = new cdk.App();
const stack = new cdk.Stack(mockApp, 'testing-stack');

new EcrImageScanNotify(stack, 'ecr-image-scan-notify', {
  webhookUrl: 'https://webhook.example.com',
});
