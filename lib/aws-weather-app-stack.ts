import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as s3 from "aws-cdk-lib/aws-s3";
import * as s3Deploy from "aws-cdk-lib/aws-s3-deployment"
import { CodePipeline, CodePipelineSource, ManualApprovalStep, ShellStep } from 'aws-cdk-lib/pipelines';
import { join } from 'path';

export class AwsWeatherAppStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const pipeline = new CodePipeline(this, 'Pipeline', {
      pipelineName: 'TestPipeline',
      synth: new ShellStep('Synth', {
        input: CodePipelineSource.gitHub('sashinshin/aws-cdk-test', 'main'),
        commands: [
          'npm ci',
          'npm run build',
          'npx cdk synth'],
      }),
    });

    const weatherS3 = new s3.Bucket(this, 'weatherS3', {
      bucketName: "weather-data",
    });

    const staticPageS3 = new s3.Bucket(this, 'staticPageS3', {
      bucketName: "cdk-test-bucket-static-site",
      publicReadAccess: true,
      websiteIndexDocument: "index.html",
      cors: [
        {
          allowedMethods: [
            s3.HttpMethods.GET,
          ],
          allowedOrigins: ['http://localhost:3000'],
          allowedHeaders: ['*'],
        },
      ]
    });

    new s3Deploy.BucketDeployment(this, "StaticPageS3Deploy", {
      sources: [s3Deploy.Source.asset(join(__dirname, "../frontend"))],
      destinationBucket: staticPageS3,
    })
  }
}
