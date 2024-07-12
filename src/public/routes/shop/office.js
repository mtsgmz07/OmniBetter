const { request, response } = require("express")
const Desktop = require('../../models/desktop')
module.exports = {
    name: "/shop/office",
    /**
    * @param {request} req
    * @param {response} res
    */
    run: async (req, res) => {
        const allDesktop = (await Desktop.getAll()).filter(x => x.category === 1).map(x => {
            return {
                id: x.desktop_id,
                name: x.title,
                price: (x.price / 100).toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.'),
                category: Desktop.getCategory(x.category),
                image: x.image.find(x => x.index === 0),
                config: {
                    processor: x.config.processor,
                    graphic: x.config.graphic,
                    ram: x.config.ram,
                    storage: x.config.storage
                }
            }
        })
        res.status(200).render("shop/office", { data: { connect: req?.user, allDesktop, basket: req?.basket } })
    }
}