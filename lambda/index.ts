import { AWSError, S3 } from "aws-sdk";
import { getEnvVar } from "../common-utils/index"
import { getWeatherData, getDate, processData } from "./utils"

export const handler = async (): Promise<S3.PutObjectOutput | AWSError> => {
    const location = 'Stockholm'
    const date = getDate();

    const weatherData = await getWeatherData(date, location);

    const param = {
        Bucket: getEnvVar("WEATHER_BUCKET_NAME"),
        Key: `data/${location.toLowerCase()}/${date}.json`,
        Body: processData(weatherData, date, location),
        ContentType: "application/json"
    }

    return await new S3().putObject(param).promise();
}