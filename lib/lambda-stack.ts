import * as cdk from 'aws-cdk-lib';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Construct } from 'constructs';
import { join } from 'path'
import { PolicyStatement, Effect } from 'aws-cdk-lib/aws-iam';

export const addRetrieveWeatherLambda = (stack: Construct, weatherBucket: cdk.aws_s3.Bucket): cdk.aws_lambda_nodejs.NodejsFunction => (
    new NodejsFunction(stack, "RetrieveWeatherDataLambda", {
        description: "Lambda that retrieves and saves weather data",
        handler: "handler",
        entry: join(__dirname, "../lambda/retrieveWeather/index.ts"),
        runtime: Runtime.NODEJS_14_X,
        timeout: cdk.Duration.seconds(30),
        environment: {
            WEATHER_BUCKET_NAME: weatherBucket.bucketName,
        },
        initialPolicy: [
            new PolicyStatement({
                effect: Effect.ALLOW,
                actions: ["ssm:GetParameter"],
                resources: ["*"]
            }),
            new PolicyStatement({
                effect: Effect.ALLOW,
                actions: ["s3:PutObject"],
                resources: [`${weatherBucket.bucketArn}/*`]
            }),

        ]
    }));

export const addAccessWeatherLambda = (stack: Construct, weatherBucket: cdk.aws_s3.Bucket) => (
    new NodejsFunction(stack, "AccessWeatherDataLambda", {
        description: "Lambda that access weather data",
        handler: "handler",
        entry: join(__dirname, "../lambda/accessWeather/index.ts"),
        runtime: Runtime.NODEJS_14_X,
        timeout: cdk.Duration.seconds(30),
        environment: {
            WEATHER_BUCKET_NAME: weatherBucket.bucketName,
        },
        initialPolicy: [
            new PolicyStatement({
                effect: Effect.ALLOW,
                actions: ["s3:ListBucket"],
                resources: [`${weatherBucket.bucketArn}/*`]
            }),
        ]
    }));