const mongoose = require('mongoose')
const token = require("../../assets/js/function/generateToken")
require("dotenv").config()
const { resizeImage } = require('../../assets/js/function/resizeImage')
const desktopSchema = mongoose.Schema({
    desktop_id: { type: String, default: token() },
    image: { type: Array, default: [] },
    title: { type: String, default: "" },
    description: { type: String, default: "" },
    price: { type: Number, default: "" },
    category: { type: Number, default: 0 },
    config: {
        case: { type: String, default: "" },
        processor: { type: String, default: "" },
        motherboard: { type: String, default: "" },
        graphic: { type: String, default: "" },
        ram: { type: String, default: "" },
        cooling: { type: String, default: "" },
        storage: { type: String, default: "" },
        powerSupply: { type: String, default: "" },
        os: { type: String, default: "" }
    },
    game: {
        fortnite: {
            high: { type: Number, default: null },
            ultra: { type: Number, default: null },
        },
        apex: {
            high: { type: Number, default: null },
            ultra: { type: Number, default: null },
        },
        valorant: {
            high: { type: Number, default: null },
            ultra: { type: Number, default: null },
        },
        cyberpunk: {
            high: { type: Number, default: null },
            ultra: { type: Number, default: null },
        },
        battlefield: {
            high: { type: Number, default: null },
            ultra: { type: Number, default: null },
        },
        rainbowsix: {
            high: { type: Number, default: null },
            ultra: { type: Number, default: null },
        }
    },
    use: { type: Number, default: 0 },
    create_time: { type: Number, default: Date.now() }
})


desktopSchema.methods.getAssembly = function (assembly) {
    if (assembly === 0) return "Intallation windows 10 pro essaie (+ 0€)"
    else if (assembly === 1) return "Activiation windows 10 pro (+ 30€)"
    else if (assembly === 2) return "Activiation windows 10 pro + Optimisation (+ 50€)"
    else return null
}

desktopSchema.methods.editImage = async function (image) {
    let ImageArray = [];
    let isValidImages = true;
    const fetchPromises = image.map(async (imageData, index) => {
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
                    link: data.data.link,
                    index: index
                });
            } else {
                isValidImages = false;
            }
        } catch (error) {
            console.error('Error uploading image:', error);
            isValidImages = false;
        }
    });

    ImageArray.sort((a, b) => a.index - b.index);

    await Promise.all(fetchPromises);

    if (!isValidImages) return false;

    this.image = ImageArray;
    await this.save();
    return this;
};

desktopSchema.methods.editInformation = async function (category, title, description, price) {
    this.category = category
    this.title = title
    this.description = description
    this.price = price
    this.save()
    return this
}

desktopSchema.methods.editComponent = async function ({ config }) {
    this.config = config
    this.save()
    return this
}

desktopSchema.methods.editGame = async function ({ game }) {
    this.game = game
    this.save()
    return this
}

desktopSchema.statics.getAll = async function () {
    const desktops = await Desktop.find();
    return Array.isArray(desktops) ? desktops : [desktops];
}

desktopSchema.statics.create = async function (image, title, description, price, category, config, game) {
    let ImageArray = [];
    let isValidImages = true;
    const fetchPromises = image.map(async (imageData, index) => {
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
                    link: data.data.link,
                    index: index
                });
            } else {
                isValidImages = false;
            }
        } catch (error) {
            console.error('Error uploading image:', error);
            isValidImages = false;
        }
    });

    await Promise.all(fetchPromises);

    if (!isValidImages) return false;

    ImageArray.sort((a, b) => a.index - b.index);

    const newDesktop = await new Desktop({
        image: ImageArray.map(image => ({ id: image.id, link: image.link, index: image.index })),
        title,
        description,
        price,
        category,
        config,
        game
    }).save();

    return newDesktop;
}

desktopSchema.statics.delete = async function (desktop_id) {
    const deleteDesktop = await Desktop.findOneAndDelete({ desktop_id })
    if (!deleteDesktop) return false
    else return true
}


desktopSchema.statics.getDesktopById = async function (desktop_id) {
    const getDesktopById = await Desktop.findOne({ desktop_id })
    if (!getDesktopById) return false
    return getDesktopById
}

desktopSchema.statics.getCategory = function (categoryId) {
    if (categoryId === 0) return "Pc Gaming"
    else if (categoryId === 1) return "Pc bureautique"
    else return null
}

desktopSchema.statics.getDesktopByName = async function (desktopName) {
    const getDesktopByName = await Desktop.findOne({ title: desktopName })
    if (!getDesktopByName) return false
    else return getDesktopByName
}


const Desktop = mongoose.model('desktop', desktopSchema)

module.exports = Desktop