const sharp = require('sharp');

async function resizeImage(base64Image) {
    try {
        const imageBuffer = Buffer.from(base64Image, 'base64');

        if (imageBuffer.length > 9 * 1024 * 1024) {
            const reducedImageBuffer = await sharp(imageBuffer)
                .jpeg({ quality: 85 })
                .toBuffer();

            if (reducedImageBuffer.length > 9 * 1024 * 1024) {
                throw new Error('Failed to reduce image size below 9 MB');
            }

            return reducedImageBuffer;
        } else {
            return imageBuffer;
        }
    } catch (error) {
        console.error('Error processing image:', error);
        throw new Error('Internal server error');
    }
}

module.exports = { resizeImage };
