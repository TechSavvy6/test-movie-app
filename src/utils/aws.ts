import AWS from "aws-sdk";
import axios from "axios";

const s3 = new AWS.S3({
  region: process.env.S3_REGION_AWS,
  accessKeyId: process.env.ACCESS_KEY_ID_AWS,
  secretAccessKey: process.env.S3_SECRET_ACCESS_KEY_AWS,
});

export async function uploadSingleImage(
  file: any,
): Promise<any> {
  return new Promise(async (resolve, reject) => {
    try {
      const filename = `test/test_${Date.now()}.png`;
      const response = await axios.get(file, { responseType: "arraybuffer" });
      const buffer = Buffer.from(response.data, "utf-8");

      const uploadedImage = await s3
        .upload({
          Bucket: process.env.S3_BUCKET_NAME_AWS!,
          Key: filename,
          Body: buffer,
        })
        .promise();
      resolve(uploadedImage.Location);
    } catch (error) {
      reject(error);
    }
  });
}
