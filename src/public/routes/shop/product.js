const { request, response } = require("express")
const Desktop = require('../../models/desktop')
module.exports = {
    name: "/shop/product/:desktopId",
    /**
    * @param {request} req
    * @param {response} res
    */
    run: async (req, res) => {
        const getDesktop = await Desktop.getDesktopById(req.params.desktopId)
        if (!getDesktop) return res.status(404).render("404", { data: { connect: req?.user } })
        const allDesktop = (await Desktop.getAll()).filter(x => x.desktop_id !== getDesktop.desktop_id).sort((a, b) => a.use - b.use).map(x => {
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
        return res.status(200).render("shop/product", { data: { connect: req?.user, getDesktop, allDesktop, basket: req?.basket } })
    }
}