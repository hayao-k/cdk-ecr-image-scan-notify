import * as path from 'path';
import * as events from '@aws-cdk/aws-events';
import * as target from '@aws-cdk/aws-events-targets';
import * as _lambda from '@aws-cdk/aws-lambda';
import * as cdk from '@aws-cdk/core';

export interface EcrImageScanNotifyProps {
  readonly webhookUrl: string;
}

export class EcrImageScanNotify extends cdk.Construct {
  constructor(scope: cdk.Construct, id: string, props: EcrImageScanNotifyProps) {
    super(scope, id);
    const lambdaFun = new _lambda.Function(this, 'lambda_fun', {
      handler: 'lambda_function.lambda_handler',
      code: _lambda.Code.fromAsset(path.join(__dirname, '../function') ),
      runtime: _lambda.Runtime.PYTHON_3_9,
      timeout: cdk.Duration.minutes(3),
      environment: {
        WEBHOOK_URL: props.webhookUrl,
      },
    });

    const ecrScanTarget = new target.LambdaFunction(lambdaFun);
    new events.Rule(this, 'EventBusEcrImageScan', {
      ruleName: 'EventBusEcrImageScanRule',
      description: 'Send ECR Image Scan findings severity counts to slack',
      targets: [ecrScanTarget],
      eventPattern: {
        source: [
          'aws.ecr',
          'aws.inspector2',
        ],
        detailType: [
          'ECR Image Scan',
          'Inspector2 Scan',
        ],
      },
    });
  }
}