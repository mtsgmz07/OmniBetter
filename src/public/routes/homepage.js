const { request, response } = require("express")
const Desktop = require('../../public/models/desktop')
module.exports = {
    name: "/",
    /**
    * @param {request} req
    * @param {response} res
    */
    run: async (req, res) => {
        const allDesktop = (await Desktop.getAll()).map(x => {
            return {
                id: x.desktop_id,
                name: x.title,
                price: (x.price / 100).toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.'),
                category: Desktop.getCategory(x.category),
                categoryInNumber: x.category,
                image: x.image.find(x => x.index === 0),
                config: {
                    processor: x.config.processor,
                    graphic: x.config.graphic,
                    ram: x.config.ram,
                    storage: x.config.storage
                }
            }
        })
        res.status(200).render("homepage", { data: { connect: req?.user, allDesktop, basket: req?.basket } })
    }
}