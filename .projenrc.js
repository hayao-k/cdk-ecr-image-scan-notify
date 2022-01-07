const { awscdk } = require('projen');

const PROJECT_NAME = 'cdk-ecr-image-scan-notify';
const PROJECT_DESCRIPTION = 'cdk-ecr-image-scan-notify is an AWS CDK construct library that notify the slack channel of Amazon ECR image scan results';
const CDK_VERSION = '1.137.0';
const project = new awscdk.AwsCdkConstructLibrary({
  name: PROJECT_NAME,
  description: PROJECT_DESCRIPTION,
  repository: 'https://github.com/hayao-k/cdk-ecr-image-scan-notify.git',
  authorAddress: 'hayaok333@gmail.com',
  authorName: 'hayao-k',
  keywords: ['aws', 'cdk', 'ecr-image', 'scan-notify'],
  compat: true,
  defaultReleaseBranch: 'main',
  stability: 'experimental',
  cdkVersion: CDK_VERSION,
  autoDetectBin: false,
  depsUpgradeOptions: {
    ignoreProjen: false,
    workflowOptions: {
      labels: ['auto-approve'],
    },
  },
  autoApproveOptions: {
    allowedUsernames: ['neilkuan', 'hayao-k'],
  },
  cdkDependencies: [
    '@aws-cdk/aws-lambda',
    '@aws-cdk/assertions',
    '@aws-cdk/core',
    '@aws-cdk/aws-events',
    '@aws-cdk/aws-events-targets',
  ],
  python: {
    distName: PROJECT_NAME,
    module: 'cdk_ecr_image_scan_notify',
  },
  workflowNodeVersion: '^14.17.0',
});


const common_exclude = ['cdk.out', 'cdk.context.json', 'yarn-error.log', 'coverage'];
project.gitignore.exclude(...common_exclude);

project.npmignore.exclude(...common_exclude, 'images');
project.synth();
