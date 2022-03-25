import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { CodePipeline, CodePipelineSource, ShellStep } from 'aws-cdk-lib/pipelines';;
import { addWeatherBucket, addStaticPageBucket } from './s3-stack';
import { addRetrieveWeatherLambda } from './lambda-stack';
import { Schedule, Rule } from 'aws-cdk-lib/aws-events';
import { addLambdaPermission, LambdaFunction } from 'aws-cdk-lib/aws-events-targets';


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

    const retrieveWeatherLambda = addRetrieveWeatherLambda(this, weatherBucket.bucketArn);

    const eventBridge = new Rule(this, "GetWeatherDataSchedule", {
      schedule: Schedule.cron({minute: "0", hour: "3", weekDay: "*"})
    })
    eventBridge.addTarget(new LambdaFunction(retrieveWeatherLambda))
    addLambdaPermission(eventBridge, retrieveWeatherLambda)
    
  }
}
