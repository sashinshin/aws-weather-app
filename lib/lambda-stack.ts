import * as cdk from 'aws-cdk-lib';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Construct } from 'constructs';
import { join } from 'path'
import { PolicyStatement, Effect } from 'aws-cdk-lib/aws-iam';

export const addRetrieveWeatherDataLambda = (stack: Construct, weatherBucketArn: string): cdk.aws_lambda_nodejs.NodejsFunction => {
    const lambda = new NodejsFunction(stack, "RetrieveWeatherDataLambda", {
        description: "Lambda that retrieves weather data",
        handler: "handler",
        entry: join(__dirname, "../lambda/index.ts"),
        runtime: Runtime.NODEJS_14_X,
        timeout: cdk.Duration.seconds(30),
        environment: {
            WEATHER_BUCKET_ARN: weatherBucketArn,
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
                resources: [weatherBucketArn]
            }),

        ]
    });


    return lambda;
};
