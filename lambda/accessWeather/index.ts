import { AWSError, S3 } from "aws-sdk";
import { getEnvVar } from "../../common-utils/index"


export const handler = async (): Promise<S3.Types.ListObjectsOutput | AWSError> => {

    const param = {
        Bucket: getEnvVar("WEATHER_BUCKET_NAME"),
        Prefix: "data/stockholm/"
    }

    console.log(getEnvVar("WEATHER_BUCKET_NAME"));
    

    const res =  await new S3().listObjectsV2(param).promise();
    console.log(res);
    
    return res;
};