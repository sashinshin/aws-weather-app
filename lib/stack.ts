import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Schedule, Rule } from 'aws-cdk-lib/aws-events';
import { addLambdaPermission, LambdaFunction } from 'aws-cdk-lib/aws-events-targets';
import { CodePipeline, CodePipelineSource, ShellStep } from 'aws-cdk-lib/pipelines';;
import { addWeatherBucket, addStaticPageBucket } from './s3-stack';
import { addRetrieveWeatherLambda, addAccessWeatherLambda } from './lambda-stack';
import { LambdaRestApi } from 'aws-cdk-lib/aws-apigateway';


export class AwsWeatherAppStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    new CodePipeline(this, 'WeatherAppPipeline', {
      pipelineName: 'WeatherAppPipeline',
      dockerEnabledForSynth: true,
      synth: new ShellStep('Synth', {
        input: CodePipelineSource.gitHub('sashinshin/aws-weather-app', 'main'),
        commands: [
          'npm ci',
          'npm run build',
          'npx cdk synth',
        ],
      }),
    });

    const weatherBucket = addWeatherBucket(this);
    addStaticPageBucket(this);

    const retrieveWeatherLambda = addRetrieveWeatherLambda(this, weatherBucket);
    const accessWeatherLambda = addAccessWeatherLambda(this, weatherBucket);

    const api = new LambdaRestApi(this, "weather-api", {
      handler: accessWeatherLambda,
      proxy: false,
    });
    const weather = api.root.addResource("weather/{location}");
    weather.addMethod("GET");

    const eventBridge = new Rule(this, "GetWeatherDataSchedule", {
      schedule: Schedule.cron({ minute: "0", hour: "3", weekDay: "*" })
    });
    eventBridge.addTarget(new LambdaFunction(retrieveWeatherLambda));
    addLambdaPermission(eventBridge, retrieveWeatherLambda);

  };
};
