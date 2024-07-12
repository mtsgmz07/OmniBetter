const mongoose = require('mongoose')
const token = require("../../assets/js/function/generateToken")
require("dotenv").config()
const { resizeImage } = require('../../assets/js/function/resizeImage')
const archivementSchema = mongoose.Schema({
    archivement_id: { type: String, default: token() },
    image: { type: Object, default: {} },
    create_time: { type: Number, default: Date.now() }
})

archivementSchema.statics.getAll = async function () {
    const archivements = await Archivement.find();
    return Array.isArray(archivements) ? archivements : [archivements];
}

archivementSchema.statics.create = async function (image) {
    let ImageArray = [];
    let isValidImages = true;
    const fetchPromises = image.map(async (imageData) => {
        try {
            const imageBuffer = await resizeImage(imageData);

            const response = await fetch("https://api.imgur.com/3/image/", {
                method: "post",
                headers: {
                    Authorization: `Client-ID ${process.env.CLIENTID_IMGUR}`,
                    'Content-Type': 'image/jpeg'
                },
                body: imageBuffer
            });

            const data = await response.json();
            if (data.data?.link) {
                ImageArray.push({
                    id: data.data.id,
                    link: data.data.link
                });
            } else {
                isValidImages = false;
            }
        } catch (error) {
            isValidImages = false;
        }
    });
    await Promise.all(fetchPromises);
    const newArchivement = Archivement({
        image: ImageArray
    }).save()
    return newArchivement;
};

archivementSchema.statics.delete = async (archivement_id) => {
    const deleteArchivement = await Archivement.findOneAndDelete({ archivement_id })
    return deleteArchivement
}

const Archivement = mongoose.model('archivement', archivementSchema)

module.exports = Archivement