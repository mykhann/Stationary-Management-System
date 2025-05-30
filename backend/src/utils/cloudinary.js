import cloudinary from "cloudinary";
import "dotenv/config";

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
});

const uploadOnCloudinary = async (fileBuffer, fileName) => {
    try {
        const result = await new Promise((resolve, reject) => {
            const uploadStream = cloudinary.v2.uploader.upload_stream(
                { resource_type: "auto", public_id: fileName },
                (error, result) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(result);
                    }
                }
            );
            uploadStream.end(fileBuffer);
        });

        return result;
    } catch (error) {
        console.log(error);
    }
};

export { cloudinary, uploadOnCloudinary };
