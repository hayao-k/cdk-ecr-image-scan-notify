const { AwsCdkConstructLibrary } = require('projen');

const project = new AwsCdkConstructLibrary({
  authorAddress: "user@domain.com",
  authorName: "hayao-k",
  cdkVersion: "1.71.0",
  name: "cdk-ecr-image-scan-notify",
  repository: "https://github.com/hayao-k/cdk-ecr-image-scan-notify.git"
});

project.synth();
