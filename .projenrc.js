const { awscdk } = require('projen');

const PROJECT_NAME = 'cdk-ecr-image-scan-notify';
const PROJECT_DESCRIPTION = 'cdk-ecr-image-scan-notify is an AWS CDK construct library that notify the slack channel of Amazon ECR image scan results';
const project = new awscdk.AwsCdkConstructLibrary({
  author: 'hayao-k',
  authorAddress: '30886141+hayao-k@users.noreply.github.com',
  autoApproveOptions: {
    allowedUsernames: ['neilkuan', 'hayao-k'],
  },
  autoDetectBin: false,
  cdkVersion: '2.31.1',
  compat: true,
  defaultReleaseBranch: 'main',
  description: PROJECT_DESCRIPTION,
  depsUpgradeOptions: {
    ignoreProjen: false,
    workflowOptions: {
      labels: ['auto-approve'],
    },
  },
  keywords: ['aws', 'cdk', 'ecr', 'image-scan-notify'],
  majorVersion: 1,
  name: PROJECT_NAME,
  publishToPypi: {
    distName: PROJECT_NAME,
    module: 'cdk_ecr_image_scan_notify',
  },
  repository: 'https://github.com/hayao-k/cdk-ecr-image-scan-notify.git',
  stability: 'experimental',
});


const common_exclude = ['cdk.out', 'cdk.context.json', 'yarn-error.log', 'coverage'];
project.gitignore.exclude(...common_exclude);

project.npmignore.exclude(...common_exclude, 'images');
project.synth();
