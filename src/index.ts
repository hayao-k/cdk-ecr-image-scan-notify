import * as path from 'path';
import * as cdk from 'aws-cdk-lib';
import * as events from 'aws-cdk-lib/aws-events';
import * as target from 'aws-cdk-lib/aws-events-targets';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { Construct } from 'constructs';

export interface EcrImageScanNotifyProps {
  readonly webhookUrl: string;
}

export class EcrImageScanNotify extends Construct {
  constructor(scope: Construct, id: string, props: EcrImageScanNotifyProps) {
    super(scope, id);
    const handler = new lambda.Function(this, 'Function', {
      handler: 'lambda_function.lambda_handler',
      code: lambda.Code.fromAsset(path.join(__dirname, '../function') ),
      architecture: lambda.Architecture.ARM_64,
      runtime: lambda.Runtime.PYTHON_3_9,
      timeout: cdk.Duration.minutes(3),
      environment: {
        WEBHOOK_URL: props.webhookUrl,
      },
    });

    const ecrScanTarget = new target.LambdaFunction(handler);
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