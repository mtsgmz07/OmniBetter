const { request, response } = require("express")
const Archivement = require('../../models/archivement')
const convertTime = require("../../../assets/js/function/convertTime")
module.exports = {
    name: "/admin/archivement",
    /**
    * @param {request} req
    * @param {response} res
    */
    run: async (req, res) => {
        const allArchivement = (await Archivement.getAll()).map(x => {
            return {
                archivement_id: x.archivement_id,
                image: x.image,
                create_time: convertTime(x.create_time, false)
            }
        })
        if (req.query?.create) return res.status(200).render("admin/archivement", { data: { connect: req?.user, popup: {}, allArchivement: allArchivement.slice(0, 10), basket: req?.basket } })
        if (allArchivement.length <= 10) return res.status(200).render("admin/archivement", { data: { connect: req?.user, totalArchivement: allArchivement.length, allArchivement, basket: req?.basket } })
        else {
            let maxPage = Number((allArchivement.length / 10).toFixed())
            let page = isNaN(Number(req.query.page)) ? 0 : Number(req.query.page) > maxPage ? 0 : Number(req.query.page)
            return res.status(200).render("admin/archivement", { data: { basket: req?.basket, connect: req?.user, totalArchivement: allArchivement.length, allArchivement: allArchivement.slice(page * 10, (page * 10) + 10), arrow: { minus: page !== 0 ? page - 1 : 0, plus: page !== maxPage ? page + 1 : maxPage, end: maxPage } } })
        }
    }
}