const { AwsCdkConstructLibrary } = require('projen');

const PROJECT_NAME = 'cdk-ecr-image-scan-notify';
const PROJECT_DESCRIPTION = 'cdk-ecr-image-scan-notify is an AWS CDK construct library that notify the slack channel of Amazon ECR image scan results';
const AUTOMATION_TOKEN = 'AUTOMATION_GITHUB_TOKEN';
const CDK_VERSION = '1.88.0';
const project = new AwsCdkConstructLibrary({
  name: PROJECT_NAME,
  description: PROJECT_DESCRIPTION,
  repository: 'https://github.com/hayao-k/cdk-ecr-image-scan-notify.git',
  authorAddress: 'hayaok333@gmail.com',
  authorName: 'hayao-k',
  keywords: ['aws', 'cdk', 'ecr-image', 'scan-notify'],
  dependabot: false,
  compat: true,
  defaultReleaseBranch: 'main',
  releaseBranches: ['main'],
  projenUpgradeSecret: AUTOMATION_TOKEN,
  stability: 'experimental',
  cdkVersion: CDK_VERSION,
  cdkDependencies: [
    '@aws-cdk/aws-iam',
    '@aws-cdk/aws-lambda',
    '@aws-cdk/core',
    '@aws-cdk/aws-ecr',
    '@aws-cdk/aws-events',
    '@aws-cdk/aws-events-targets',
  ],
  python: {
    distName: PROJECT_NAME,
    module: 'cdk_ecr_image_scan_notify',
  },
});
workflow = project.github.addWorkflow('ProjenYarnUpgrade');

workflow.on({
  schedule: [{
    cron: '11 0 * * *',
  }], // 0:11am every day
  workflow_dispatch: {}, // allow manual triggering
});

workflow.addJobs({
  upgrade: {
    'runs-on': 'ubuntu-latest',
    'steps': [
      { uses: 'actions/checkout@v2' },
      {
        uses: 'actions/setup-node@v1',
        with: {
          'node-version': '10.17.0',
        },
      },
      { run: 'yarn upgrade' },
      { run: 'yarn projen:upgrade' },
      // submit a PR
      {
        name: 'Create Pull Request',
        uses: 'peter-evans/create-pull-request@v3',
        with: {
          'token': '${{ secrets.' + AUTOMATION_TOKEN + ' }}',
          'commit-message': 'chore: upgrade projen',
          'branch': 'auto/projen-upgrade',
          'title': 'chore: upgrade projen and yarn',
          'body': 'This PR upgrades projen and yarn upgrade to the latest version',
          'labels': 'auto-merge',
        },
      },
    ],
  },
});

const common_exclude = ['cdk.out', 'cdk.context.json', 'yarn-error.log', 'coverage'];
project.gitignore.exclude(...common_exclude);

project.npmignore.exclude(...common_exclude, 'images');
project.synth();
