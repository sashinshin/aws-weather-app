import * as s3 from "aws-cdk-lib/aws-s3";
import * as s3Deploy from "aws-cdk-lib/aws-s3-deployment"
import { Construct } from 'constructs';
import { join } from 'path';

export const addWeatherBucket = (stack: Construct): s3.Bucket => (
    new s3.Bucket(stack, 'WeatherS3', {
        bucketName: "weather-data-sashin",
    }));

export const addStaticPageBucket = (stack: Construct): s3.Bucket => {
    const staticPageS3 = new s3.Bucket(stack, 'StaticPageS3', {
        bucketName: "weather-app-static-page-sashin",
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
    new s3Deploy.BucketDeployment(stack, "StaticPageS3Deploy", {
        sources: [s3Deploy.Source.asset(join(__dirname, "../website-dist"))],
        destinationBucket: staticPageS3,
    });

    return staticPageS3;
};
