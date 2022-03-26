import { AWSError, S3 } from "aws-sdk";
import { getEnvVar } from "../../common-utils/index"


export const handler = async (): Promise<S3.GetObjectOutput | AWSError | unknown> => {

    const listParam = {
        Bucket: getEnvVar("WEATHER_BUCKET_NAME"),
        Prefix: "data/stockholm/"
    }
    const s3 = new S3();
    const objectList =  await s3.listObjectsV2(listParam).promise();
    const keys = objectList.Contents?.map((obj) => obj.Key ? obj.Key : "");
    if (!keys) {
        throw new Error("failed");
    }

    const promiseList = keys.map((key) => {
        const param = {
            Bucket: getEnvVar("WEATHER_BUCKET_NAME"),
            Key: key,
        }
        return s3.getObject(param).promise();
    });
    const res = promiseList.map(async (element) => await element);
    console.log(res);
    
    const t = await s3.getObject( {
        Bucket: getEnvVar("WEATHER_BUCKET_NAME"),
        Key: keys[0],
    }).promise()

    const t2 = await s3.getObject( {
        Bucket: getEnvVar("WEATHER_BUCKET_NAME"),
        Key: keys[1],
    }).promise()

    console.log(t);
    console.log(t2);
    
    
    // const res = await Promise.all(promiseList).then(res => res);
    // console.log(res);
    
    return res;
};