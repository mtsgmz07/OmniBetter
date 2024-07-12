const { request, response } = require("express")
const Desktop = require('../../models/desktop')
module.exports = {
    name: "/admin/shop",
    /**
    * @param {request} req
    * @param {response} res
    */
    run: async (req, res) => {
        let allDesktop = (await Desktop.getAll()).map(x => {
            return {
                desktop_id: x.desktop_id,
                image: x.image,
                title: x.title,
                price: (x.price / 100).toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.'),
                category: Desktop.getCategory(x.category),
                categoryInNumber: x.category,
                config: {
                    processor: x.config.processor,
                    graphic: x.config.graphic,
                    ram: x.config.ram,
                    storage: x.config.storage
                }
            }
        })
        let filter = {}
        if (Number(req.query?.filter) >= 0 && Number(req.query?.filter) <= 3) {
            filter.type = req.query?.filter
            allDesktop = allDesktop.filter(x => x.categoryInNumber === Number(req.query?.filter))
        }
        if (req.query?.create) return res.status(200).render("admin/shop", { data: { connect: req?.user, popup: {}, allDesktop: allDesktop.slice(0, 10), basket: req?.basket } })
        if (allDesktop.length <= 10) return res.status(200).render("admin/shop", { data: { filter, connect: req?.user, totalDesktop: allDesktop.length, allDesktop, basket: req?.basket } })
        else {
            let maxPage = Number((allDesktop.length / 10).toFixed())
            let page = isNaN(Number(req.query.page)) ? 0 : Number(req.query.page) > maxPage ? 0 : Number(req.query.page)
            return res.status(200).render("admin/shop", { data: { basket: req?.basket, filter, connect: req?.user, totalDesktop: allDesktop.length, allDesktop: allDesktop.slice(page * 10, (page * 10) + 10), arrow: { minus: page !== 0 ? page - 1 : 0, plus: page !== maxPage ? page + 1 : maxPage, end: maxPage } } })
        }
    }
}