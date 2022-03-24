import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as s3 from "aws-cdk-lib/aws-s3";
import * as s3Deploy from "aws-cdk-lib/aws-s3-deployment"
import { CodePipeline, CodePipelineSource, ManualApprovalStep, ShellStep } from 'aws-cdk-lib/pipelines';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { join } from 'path';

export class AwsWeatherAppStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
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
          allowedOrigins: ['*'],
          allowedHeaders: ['*'],
        },
      ]
    });

    new s3Deploy.BucketDeployment(this, "StaticPageS3Deploy", {
      sources: [s3Deploy.Source.asset(join(__dirname, "../frontend"))],
      destinationBucket: staticPageS3,
    });

    new NodejsFunction(this, "lambda", {
      description: "Lambda",
      handler: "handler",
      entry: join(__dirname, "../lambda/index.ts"),
      runtime: Runtime.NODEJS_14_X,
      timeout: cdk.Duration.seconds(30),
    });

  }
}
