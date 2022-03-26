import { AWSError, S3 } from "aws-sdk";
import { getEnvVar } from "../common-utils/index"
import { apiCall, getDate, processData } from "./utils"

export const handler = async (): Promise<S3.PutObjectOutput | AWSError> => {
    //event bridge triggered lambda

    const location = 'Stockholm'
    const date = getDate();

    const data = await apiCall(date, location);

    const param = {
        Bucket: getEnvVar("WEATHER_BUCKET_NAME"),
        Key: `data/${location.toLowerCase()}/date.json`,
        Body: processData(data, date, location),
        ContentType: "application/json"
    }
    console.log(param);
    const res = await new S3().putObject(param).promise();
    console.log(res);
    
    return res
}