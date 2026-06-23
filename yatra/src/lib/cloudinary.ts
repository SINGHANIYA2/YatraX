import { v2 as cloudinary } from 'cloudinary'
// import { Elsie_Swash_Caps } from 'next/font/google';
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary = async (file: Blob) => {
    if (!file) {
        return null
    }
    try {

        const arrayBuffer = await file.arrayBuffer()
        const buffer = Buffer.from(arrayBuffer)

        return new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream({
                resource_type: "auto"
            }, (error, result) => {
                console.log("CLOUDINARY RESULT:");
                console.log(result);
                if (error) {
                    reject(error)
                }
                else {
                    resolve({
                        url: result?.secure_url,
                        fileId: result?.public_id,
                        fileName: file instanceof File ? file.name : "",
                        mimeType: file.type,
                        size: file.size,
                    })
                }
            })
            uploadStream.end(buffer)
        })


    } catch (err) {
        console.log(err)
        return null
    }
}
export default uploadOnCloudinary