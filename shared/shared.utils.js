import AWS from "aws-sdk";

AWS.config.update({
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

export const uploadPhotoToS3 = async (file, userId, directory) => {
  const { filename, createReadStream } = await file;
  const readStream = createReadStream();
  const storeFileName = `${directory}/${userId}-${Date.now()}-${filename}`;

  const { Location } = await new AWS.S3()
    .upload({
      Body: readStream,
      Bucket: "outstagram-uploads",
      Key: storeFileName,
      ACL: "public-read",
    })
    .promise();

  return Location;
};
