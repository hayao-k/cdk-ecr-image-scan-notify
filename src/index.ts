import * as path from 'path';
import * as events from '@aws-cdk/aws-events';
import * as target from '@aws-cdk/aws-events-targets';
import * as iam from '@aws-cdk/aws-iam';
import * as _lambda from '@aws-cdk/aws-lambda';
import * as cdk from '@aws-cdk/core';

export interface EcrImageScanNotifyProps {
  readonly webhookUrl: string;
  readonly channel: string;
}

export class EcrImageScanNotify extends cdk.Construct {
  constructor(scope: cdk.Construct, id: string, props: EcrImageScanNotifyProps) {
    super(scope, id);
    const lambdaFun = new _lambda.Function(this, 'lambda_fun', {
      handler: 'lambda_function.lambda_handler',
      code: _lambda.Code.fromAsset(path.join(__dirname, '../function') ),
      runtime: _lambda.Runtime.PYTHON_3_8,
      timeout: cdk.Duration.minutes(3),
      environment: {
        WEBHOOK_URL: props.webhookUrl,
        CHANNEL: props.channel,
      },
    });

    const ecrReadOnlyPolicyStatement = new iam.PolicyStatement({
      actions: ['ecr:DescribeImages'],
      resources: ['*'],
    });
    lambdaFun.role!.addToPrincipalPolicy(ecrReadOnlyPolicyStatement);
    const ecrScanTarget = new target.LambdaFunction(lambdaFun);
    new events.Rule(this, 'EventBusEcrImageScan', {
      ruleName: 'EventBusEcrImageScanRule',
      description: 'ECR Scan and event to lambda to Slack',
      targets: [ecrScanTarget],
      eventPattern: {
        source: ['aws.ecr'],
        detailType: ['ECR Image Scan'],
      },
    });
  }
}