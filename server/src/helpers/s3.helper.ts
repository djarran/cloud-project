import { bucketName, s3 } from "../server.ts";

export const storeInS3 = async (s3Key: string, wikipediaData: any) => {

    // Store in S3
    const body = JSON.stringify({
        source: "S3 Bucket",
        ...wikipediaData,
    });

    const objectParams = { Bucket: bucketName, Key: s3Key, Body: body };

    await s3.putObject(objectParams).promise();

    console.log(`Successfully uploaded data to ${bucketName}-${s3Key}`);
    return
}

export const getFromS3 = async (key: string) => {
    try {
        const result = await s3.getObject({ Bucket: process.env.S3_BUCKET_NAME as string, Key: key }).promise()
        let object
        if (result.Body) {
            //@ts-ignore
            object = JSON.parse(result.Body)
        }
        return object
    }
    catch (err) {
        return undefined
    }

}