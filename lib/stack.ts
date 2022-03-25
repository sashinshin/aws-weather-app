import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { CodePipeline, CodePipelineSource, ShellStep } from 'aws-cdk-lib/pipelines';;
import { addWeatherBucket, addStaticPageBucket } from './s3-stack';
import { addRetrieveWeatherDataLambda } from './lambda-stack';

export class AwsWeatherAppStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const pipeline = new CodePipeline(this, 'WeatherAppPipeline', {
      pipelineName: 'WeatherAppPipeline',
      dockerEnabledForSynth: true,
      synth: new ShellStep('Synth', {
        input: CodePipelineSource.gitHub('sashinshin/aws-weather-app', 'main'),
        commands: [
          'npm ci',
          'npm run build',
          'npx cdk synth'],
      }),
    });

    const weatherBucket = addWeatherBucket(this);
    addStaticPageBucket(this);

    addRetrieveWeatherDataLambda(this, weatherBucket.bucketArn);


  }
}
