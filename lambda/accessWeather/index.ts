import { AWSError, S3 } from "aws-sdk";
import { getEnvVar } from "../../common-utils/index"


export const handler = async (): Promise<S3.Types.ListObjectsOutput | AWSError> => {

    const param = {
        Bucket: getEnvVar("WEATHER_BUCKET_NAME"),
        Prefix: "data/stockholm/"
    }

    console.log(getEnvVar("WEATHER_BUCKET_NAME"));
    
    const re2s =  await new S3().getObject({
        Bucket: "weather-bucket-sashin",
        Key: "data/stockholm/2022-03-25"
    }).promise();

    console.log(re2s);
    
    

    const res =  await new S3().listObjectsV2(param).promise();
    console.log(res);
    
    return res;
};