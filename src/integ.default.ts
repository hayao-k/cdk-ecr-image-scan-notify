import * as cdk from '@aws-cdk/core';
import { EcrImageScanNorify } from './index';

const mockApp = new cdk.App();
const stack = new cdk.Stack(mockApp, 'testing-stack');

new EcrImageScanNorify(stack, 'ecrimagescan', {
  webhookUrl: 'https://webhook.example.com',
  channel: 'event_channel',
});