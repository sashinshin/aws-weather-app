import { S3 } from "aws-sdk";
import { getEnvVar } from "../../common-utils/index";

const s3 = new S3();

const getKeys = async (): Promise<string[]> => {
    const location = "stockholm";
    const listParam = {
        Bucket: getEnvVar("WEATHER_BUCKET_NAME"),
        Prefix: `data/${location}/`
    }
    const objectList = await s3.listObjectsV2(listParam).promise();
    const keys = objectList.Contents?.map((obj) => obj.Key ? obj.Key : "");
    if (!keys) {
        throw new Error("failed");
    }
    return keys;
};

const getWeatherData = async (keys: string[]): Promise<(string | undefined)[]> => {
    const promiseList = keys.map((key) => {
        const param = {
            Bucket: getEnvVar("WEATHER_BUCKET_NAME"),
            Key: key,
        }
        return s3.getObject(param).promise();
    });
    const res = await Promise.all(promiseList).then(res => res);
    return res.map(res => res.Body?.toString('utf-8'));
};

export const handler = async (): Promise<(string | undefined)[]> => {
    const keys = await getKeys();
    const weatherData = getWeatherData(keys);

    return weatherData;
};